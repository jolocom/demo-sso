import * as React from 'react'
import { Button } from 'react-bootstrap'

interface Props {
  handleOnClick: () => any;
  // enthusiasmLevel?: number;
}

interface State {

}

export class SSOComponent extends React.Component<Props, State> {
  render() {

    return (
      <Button 
        bsStyle="primary"
        onClick= {this.props.handleOnClick}>
          Login with Jolocom
      </Button>
    )
  }
}