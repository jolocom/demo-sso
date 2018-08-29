export interface StoreState {
  qrCode: string
  errorMsg: string 
  status: string
  open: boolean
  isFetching: boolean
  responseToken: string
  clientId: string 
  // TYPINGS FOR USERDATA!!!
  /////////////////////////
  userData: any
}