import React from 'react'
import { connect } from 'react-redux'
import { DefaultState, loginProviders } from '../../reducers/index'
import { UserData } from './types'
import { initiateReceiving, initiateLogin, initiatePayment } from '../../actions/index'
import { LoginDialog } from '../components/dialog'
import { DashboardComponent } from '../components/dashboard'

interface State {
  userInput: string
  showDialog: boolean
}

interface Props {
  userData: UserData
  qrReceiveCode: string
  issueCredential: (did: string, answer: string) => void
  requestPayment: (userId: string) => void
  handleInput: (el: React.MouseEvent<HTMLElement>) => void
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

  handleIssueCredential = (el: React.MouseEvent<HTMLElement>) => {
    this.props.issueCredential(this.props.userData.did, this.state.userInput)
    this.setState({showDialog: true})
  }

  handleRequestPayment = () => {
    this.props.requestPayment(this.props.userData.userId)
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
          handleIssueCredential={this.handleIssueCredential}
          handleRequestPayment={this.handleRequestPayment}
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
    issueCredential: (did: string, answer: string) => dispatch(initiateReceiving(did, answer)),
    requestPayment: (userId: string) => dispatch(initiatePayment(userId)),
    initiateLogin: (provider: loginProviders) => dispatch(initiateLogin(provider))
  }
}

export const Dashboard = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardContainer)
