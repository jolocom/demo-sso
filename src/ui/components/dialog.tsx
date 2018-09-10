import React from 'react'
import { Dialog, DialogTitle, withStyles } from '@material-ui/core'
import { loginProviders } from '../../reducers'

interface Props {
  open: boolean
  provider: loginProviders
  qrCode: string
}

const ModifiedDialog = withStyles({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1%',
    minWidth: '300px'
  },
})(Dialog)

export const LoginDialog: React.SFC<Props> = props => {
  const isJolocom = props.provider === loginProviders.jolocom
  const { title, text } = getContentByProvider(props.provider)

  return (
    <ModifiedDialog open={props.open}>
      {/* {isJolocom ? <img src='/src/img/logo.svg' style={{height: '15px'}}/>: null} */}
      <DialogTitle> {title} </DialogTitle>
      <span> {text} </span>
      {isJolocom ? <img src={props.qrCode} width={'100%'}/> : null}
    </ModifiedDialog>
  )
}

interface returnValue {
  title: string
  text: string
}

const getContentByProvider = (loginProvider: loginProviders): returnValue => {
  switch (loginProvider) {
    case loginProviders.facebook:
      return {
        title: 'Log in with Facebook',
        text: 'Nope'
      }
    case loginProviders.linkedIn:
      return {
        title: 'Log in with LinkedIn',
        text: 'Do not'
      }
    case loginProviders.jolocom:
      return {
        title: 'Log in with Jolocom',
        text: 'Please scan the QR code'
      }
    default:
      return {
        title: '',
        text: ''
      }
  }
}
