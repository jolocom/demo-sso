import * as React from 'react';

export interface Props {
  name: string;
  // enthusiasmLevel?: number;
}

class SSO extends React.Component<Props, object> {
  render() {
    const { name } = this.props

    return (
      <div className="main">
        <div className="login">
          Hello {name} .
        </div>
      </div>
    );
  }
}

export default SSO