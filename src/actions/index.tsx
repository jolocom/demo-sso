import * as constants from './constants'
import { JolocomLib } from 'jolocom-lib'

// const BASE_URL = 'https://demo-sso.jolocom.com'

export interface SetClientId{
    type: constants.SET_CLIENT_ID;
    value: string
}

export interface ShowQRCode {
    type: constants.SHOW_QR_CODE;
}

export interface HideQRCode {
  type: constants.HIDE_QR_CODE;
}

export interface StartFetch{
  type: constants.START_FETCH;
}

export interface StopFetch {
  type: constants.STOP_FETCH;
}

export interface SetResponseToken {
  type: constants.SET_RESPONSE_TOKEN;
  value: string
}

export interface SetQRCode {
  type: constants.SET_QR_CODE;
  value: string
}

export interface SetCredentials {
  type: constants.SET_CREDENTIALS;
  value: string
}

export interface Logout {
  type: constants.LOGOUT;
}

export type SSOActions = SetClientId | ShowQRCode | HideQRCode | StartFetch | StopFetch | SetResponseToken | SetQRCode | SetCredentials | Logout

export function SetClientId(id: string): SetClientId {
    return {
        type: constants.SET_CLIENT_ID,
        value: id
    }
}

export function setResponseToken(responseToken: string): SetResponseToken {
  return {
    type: constants.SET_RESPONSE_TOKEN,
    value: responseToken
  }
}

export function setQRCode(qrCode: string): SetQRCode {
  return {
    type: constants.SET_QR_CODE,
    value: qrCode
  }
}

export function setCredentials(credentials: string): SetCredentials {
  return {
    type: constants.SET_CREDENTIALS,
    value: credentials
  }
}

export function initiateSSO() : any {
  // const jolocomLib = new JolocomLib()
  const randomUrl = '12345TEST'
  const registry = JolocomLib.registry.jolocom.create()
  console.log(registry, randomUrl)

  return registry
}