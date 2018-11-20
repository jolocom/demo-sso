import { loginProviders } from '../reducers'
import io from 'socket.io-client'
import { push } from 'connected-react-router'
import { UserData } from '../ui/containers/types'
import { randomString } from '../utils'

export const showDialog = (providerName: loginProviders) => {
  return {
    type: 'DIALOG_SHOW',
    value: providerName
  }
}

export const hideDialog = () => {
  return {
    type: 'DIALOG_HIDE'
  }
}

export const setQRCode = (encodedImage: string) => {
  return {
    type: 'QR_CODE_SET',
    value: encodedImage
  }
}

export const setUserData = (data: UserData) => {
  return {
    type: 'USER_DATA_SET',
    value: data
  }
}

export const setReceivedQr = (encodedImage: string) => {
  return {
    type: 'QR_RECEIVE_SET',
    value: encodedImage
  }
}

export const initiateLogin = (loginProvider: loginProviders) => {
  return async (dispatch: Function) => {
    if (loginProvider !== loginProviders.jolocom) {
      return dispatch(showDialog(loginProvider))
    }

    const randomId = randomString(5)
    const qrCode = await getQrCode(randomId)

    dispatch(setQRCode(qrCode))
    dispatch(showDialog(loginProvider))

    const data = await awaitUserData(randomId)
    const parsed = JSON.parse(data)

    dispatch(setQRCode(undefined))
    dispatch(setUserData(parsed))
    dispatch(push('/dashboard'))
  }
}

export const initiateReceiving = (did: string, answer: string) => {
  return async (dispatch: Function) => {
    const qrCode = await getOfferQrCode(did, answer)
    dispatch(setReceivedQr(qrCode))
  }
}

const getOfferQrCode = async (did: string, answer: string): Promise<string> => {
  const socket = io(`/qr-receive`, { query: { did, answer} })
  return new Promise<string>(resolve => {
    socket.on(did, (qrCode: string) => resolve(qrCode))
  })
}


const getQrCode = async (randomId: string): Promise<string> => {
  const socket = io(`/qr-code`, { query: { userId: randomId } })
  return new Promise<string>(resolve => {
    socket.on(randomId, (qrCode: string) => resolve(qrCode))
  })
}

export const awaitUserData = async (randomId: string): Promise<string> => {
  const socket = io(`/sso-status`, {
    query: { userId: randomId }
  })

  return new Promise<string>(resolve => {
    socket.on(randomId, (data: string) => resolve(data))
  })
}