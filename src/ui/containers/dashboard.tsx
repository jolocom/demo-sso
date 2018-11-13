import React from 'react'
import { connect } from 'react-redux'
import { DefaultState, loginProviders } from '../../reducers/index'
import { UserData } from './types'
import { initiateReceiving, initiateLogin } from '../../actions/index'
import { LoginDialog } from '../components/dialog'
import { DashboardComponent } from '../components/dashboard'

interface State {
  userInput: string
  showDialog: boolean
}

interface Props {
  userData: UserData
  qrReceiveCode: string
  getCredential: (did: string, answer: string) => void
  handleInput: (el: React.MouseEvent<HTMLElement>) => void
}

const styles = {
  container: {
    backgroundColor: 'black',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  } as React.CSSProperties,
  banner: {
    background: 'url(/img/banner.jpg) center no-repeat',
    height: '260px',
    width: '100%',
    backgroundSize: 'auto 100%'
  },
  button: {
    margin: '0px',
    borderRadius: '4px',
    padding: '34dp 12dp 34dp 16dp'
  },
  text: {
    color: 'white'
  },
  userDataText: {
    color: 'white',
    marginTop: '15px'
  }
}

export class DashboardContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      userInput: '',
      showDialog: false
    }
  }

  handleUserInput = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ userInput: e.currentTarget.value })
  }

  handleButtonClick = (el: React.MouseEvent<HTMLElement>) => {
    this.props.getCredential(this.props.userData.did, this.state.userInput)
    this.setState({showDialog: true})
  }

  render() {
    const { givenName, did } = this.props.userData
    const { userInput, showDialog } = this.state
    const { qrReceiveCode } = this.props

    return (
      <div>
        <DashboardComponent
          did={did}
          name={givenName}
          handleUserInput={this.handleUserInput}
          inputValue={userInput}
          handleButtonClick={this.handleButtonClick}
        />
        <LoginDialog
          provider={loginProviders.jolocom}
          open={showDialog && !!qrReceiveCode}
          qrCode={qrReceiveCode}
          onClose={() => {this.setState({showDialog: false})}}
        />
      </div>
    )
  }
}

const mapStateToProps = (state: DefaultState) => {
  return {
    userData: state.userData,
    qrReceiveCode: state.dialog.qrReceiveCode
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    getCredential: (did: string, answer: string) => dispatch(initiateReceiving(did, answer)),
    initiateLogin: (provider: loginProviders) => dispatch(initiateLogin(provider))
  }
}

export const Dashboard = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardContainer)
