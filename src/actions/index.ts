import { loginProviders } from '../reducers'
import io from 'socket.io-client'
import { push } from 'connected-react-router'
import {baseUrl} from '../../config'
import { UserData } from '../ui/containers/types';

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

    dispatch(setUserData(JSON.parse(data)))
    dispatch(push('/dashboard'))
  }
}

const getQrCode = async (randomId: string): Promise<string> => {
  const socket = io(`${baseUrl}/qr-code`, { query: { userId: randomId } })

  return new Promise<string>(resolve => {
    socket.on(randomId, (qrCode: string) => resolve(qrCode))
  })
}

export const awaitUserData = async (randomId: string): Promise<string> => {
  const socket = io(`${baseUrl}/sso-status`, {
    query: { userId: randomId }
  })

  return new Promise<string>(resolve => {
    socket.on(randomId, (data: string) => resolve(data))
  })
}

const randomString = (length: number) => {
  return Math.random()
    .toString(36)
    .substr(2, length)
}