import { SSOActions } from '../actions/index'
import { StoreState } from '../types/index'
import * as constants from '../actions/constants'

// const initialState: StoreState = {
//   qrCode: '',
//   errorMsg: '',
//   status: '',
//   open: false,
//   isFetching: false,
//   responseToken: '',
//   clientId: '',
//   userData: []
// }

export function rootReducer (state: StoreState, action: SSOActions): StoreState {
  switch (action.type) {
    case constants.SET_CLIENT_ID:
      return { ...state, clientId: state.clientId = action.value }
    case constants.SHOW_QR_CODE:
      return { ...state, open: true }
    case constants.HIDE_QR_CODE:
      return { ...state, open: false }
    case constants.START_FETCH:
      return { ...state, isFetching: true }
    case constants.STOP_FETCH:
      return { ...state, isFetching: false }
    case constants.SET_RESPONSE_TOKEN:
      return { ...state, responseToken: action.value }
    case constants.SET_QR_CODE:
      return { ...state, qrCode: action.value }
    case constants.SET_CREDENTIALS:
      return { ...state, isFetching: true }
    case constants.LOGOUT:
      return state
    default: return state
  }
}