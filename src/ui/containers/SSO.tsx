import * as React from 'react'
import SSOComponent from '../components/SSO';
import * as actions from '../../actions/';
import { StoreState } from '../../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux'

interface Props {
  handleOnClick: () => any;
}

interface State {

}

export class SSOContainer extends React.Component<Props, State> {

  render() {
    return (
    <SSOComponent
      handleOnClick={ this.props.handleOnClick }
     />
    )
  }
}



const mapStateToProps = (state: StoreState) => {
  return {
    qrCode: '',
    errorMsg: '',
    status: '',
    open: false,
    isFetching: false,
    responseToken: '',
    clientId: '',
    userData: []
  }
}

const mapDispatchToProps = (dispatch: Dispatch<actions.SSOActions>) => {
  return {
    handleOnClick: () => dispatch(actions.initiateSSO()) 
    // onDecrement: () => dispatch(actions.decrementEnthusiasm()),
  }
}

export const SSO = connect(mapStateToProps, mapDispatchToProps)(SSOContainer);