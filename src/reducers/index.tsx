export enum loginProviders {
  none = 'none',
  jolocom = 'jolocom',
  linkedIn = 'linkedIn',
  facebook = 'facebook'
}

export interface DefaultState {
  dialog: {
    loginProvider: loginProviders
    qrCode: string
    qrReceiveCode: string
  }
  userData: {
    did: string
    email: string
    givenName: string
    familyName: string
  }
}

export const defaultState: DefaultState = {
  dialog: {
    loginProvider: loginProviders.none,
    qrCode: '',
    qrReceiveCode: ''
  },
  userData: {
    did: '',
    email: '',
    givenName: '',
    familyName: ''
  }
}

export function rootReducer(state = defaultState, action: any) {
  switch (action.type) {
    case 'USER_DATA_SET':
      return {...state, userData: {...action.value.data}}
    case 'USER_DATA_RESET':
      return {...state, userData: defaultState.userData}
    case 'DIALOG_SHOW':
      return {...state, dialog: { ...state.dialog, loginProvider: action.value }}
    case 'DIALOG_HIDE':
      return {...state, dialog: { ...state.dialog, loginProvider: loginProviders.none }}
    case 'QR_CODE_SET':
      return {...state, dialog: { ...state.dialog, qrCode: action.value}}
    case 'QR_RECEIVE_SET':
      return {...state, dialog: { ...state.dialog, qrReceiveCode: action.value}}
    default:
      return state
  }
}
