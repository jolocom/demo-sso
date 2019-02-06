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
    const authQrCode = await getAuthQrCode(randomId)

    dispatch(setQRCode(authQrCode))
    dispatch(showDialog(loginProvider))

    const data = await awaitUserData(randomId)
    const parsed = JSON.parse(data)
    const userData = { ...parsed.data, userId: randomId } 

    dispatch(setQRCode(undefined))
    dispatch(setUserData(userData))
    dispatch(push('/dashboard'))
  }
}

export const initiateReceiving = (did: string, answer: string) => {
  return async (dispatch: Function) => {
    const qrCode = await getOfferQrCode(did, answer)
    dispatch(setReceivedQr(qrCode))
  }
}

export const initiatePayment = (userId: string) => {
  return async (dispatch: Function) => {
    const qrCode = await getPaymentRequestQrCode(userId)
    dispatch(setReceivedQr(qrCode))
  }
}

export const getPaymentRequestQrCode = (userId: string) => {
  const socket = io(`/qr-payment`, { query: { userId } })
  return new Promise<string>(resolve => {
    socket.on(userId, (qrCode: string) => resolve(qrCode))
  })
}

const getOfferQrCode = async (did: string, answer: string): Promise<string> => {
  const socket = io(`/qr-credReceive`, { query: { did, answer } })
  return new Promise<string>(resolve => {
    socket.on(did, (qrCode: string) => resolve(qrCode))
  })
}

const getAuthQrCode = async (randomId: string): Promise<string> => {
  const socket = io(`/qr-auth`, { query: { userId: randomId } })
  return new Promise<string>(resolve => {
    socket.on(randomId, (qrCode: string) => resolve(qrCode))
  })
}

export const awaitUserData = async (userId: string): Promise<string> => {
  const socket = io(`/sso-status`, {
    query: { userId }
  })

  return new Promise<string>(resolve => {
    socket.on(userId, (data: string) => resolve(data))
  })
}
