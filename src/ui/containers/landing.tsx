import * as React from 'react'
import { LandingComponent } from '../components/landing'
import * as actions from '../../actions'
import { connect } from 'react-redux'
import { loginProviders, DefaultState } from '../../reducers'

interface Props {
  initiateLogin: (name: loginProviders) => void
  selectedLoginProvider: loginProviders
  qrCode: string
}

interface State {}

export class LandingContainer extends React.Component<Props, State> {
  render() {
    return (
      <LandingComponent
        initiateLogin={this.props.initiateLogin}
        selectedLoginProvider={this.props.selectedLoginProvider}
        qrCode={this.props.qrCode}
      />
    )
  }
}

const mapStateToProps = (state: DefaultState) => {
  return {
    selectedLoginProvider: state.dialog.loginProvider,
    qrCode: state.dialog.qrCode
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    initiateLogin: (name: loginProviders) => dispatch(actions.initiateLogin(name))
  }
}

export const Landing = connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingContainer)
