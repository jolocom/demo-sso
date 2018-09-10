import * as React from 'react'
import Button from '@material-ui/core/Button'
import { PropTypes } from '@material-ui/core'
import { loginProviders } from '../../reducers'
import { LoginDialog } from './dialog'

interface Props {
  initiateLogin: (name: loginProviders) => void
  selectedLoginProvider: loginProviders
  qrCode: string
}

interface State {}

// TODO Abstract?
export class LandingComponent extends React.Component<Props, State> {
  getStyles() {
    return {
      pageBackground: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',

        backgroundImage: 'url("src/img/SSO_bg.jpg")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      } as React.CSSProperties,
      loginOptionsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        maxWidth: '600px',
        maxHeight: '500px',
        width: '40vw',
        height: '40vh',
        minWidth: '400px',
        minHeight: '300px',
        borderRadius: '5px',
        backgroundColor: 'white'
      } as React.CSSProperties
    }
  }

  render() {
    const { loginOptionsContainer, pageBackground } = this.getStyles()
    return (
      <div style={pageBackground}>
        <div style={loginOptionsContainer}>
          <div style={{fontSize: '30px', fontWeight: 300}}> Join Us </div>
          <AbstractedButton
            color={'secondary'}
            text={'Log in with LinkedIn'}
            imageName={'LI_icon.svg'}
            onClick={() => this.props.initiateLogin(loginProviders.linkedIn)}
          />
          <AbstractedButton
            color={'secondary'}
            text={'Log in with Facebook'}
            imageName={'FB_icon.svg'}
            onClick={() => this.props.initiateLogin(loginProviders.facebook)}
          />
          <div style={{ color: 'grey' }}> or </div>
          <AbstractedButton
            text={'Continue with Jolocom'}
            imageName={'JO_icon.svg'}
            color={'primary'}
            onClick={() => this.props.initiateLogin(loginProviders.jolocom)}
          />
        </div>
        <LoginDialog
          open={this.props.selectedLoginProvider !== loginProviders.none}
          provider={this.props.selectedLoginProvider}
          qrCode={this.props.qrCode}
        />
      </div>
    )
  }
}

interface ButtonProps {
  color: PropTypes.Color
  onClick: () => void
  imageName: string
  text: string
}

const AbstractedButton: React.SFC<ButtonProps> = props => {
  const buttonStyle = {
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    height: '10%',
    marginTop: '20px',
    marginBottom: '20px'
  }

  const { color, onClick, imageName, text } = props
  return (
    <Button style={buttonStyle} variant="contained" color={color} onClick={onClick}>
      <img height={16} style={{marginRight: '5%'}} src={`src/img/${imageName}`} />
      {text}
    </Button>
  )
}
