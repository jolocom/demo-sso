import React from 'react'
import { List, ListItem, Button } from '@material-ui/core'
import { connect } from 'react-redux'
import { DefaultState } from '../../reducers'
import { UserData } from './types'

interface State {}
interface Props {
  userData: UserData
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
    background: 'url(src/img/banner.jpg) center no-repeat',
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
  render() {
    // const { givenName, familyName, did, email } = this.props.userData
    const givenName = 'Eugeniu'
    const familyName = 'Rusu'
    const email = 'eugeniu@jolocom.com'

    return (
      <div style={styles.container}>
        <div style={styles.banner} />
        <div style={{ ...styles.text, fontSize: '24px', fontWeight: 300 }}>
          Thank you for participating in our alpha release!
        </div>
        <div>
          <div style={styles.userDataText}>You shared the following data with us:</div>
          <div style={styles.userDataText}> {`Name: ${givenName} ${familyName}`} </div>
          <div style={styles.userDataText}> {`Email address: ${email}`}</div>
        </div>
        <div>
          <div style={styles.text}>The data you shared is only used for rendering purposes on this page.</div>
          <div style={styles.text}>And we will forget it as soon as you leave this page.</div>
          <div style={styles.text}>Check out the source code </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button style={styles.button}>Exit</Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: DefaultState) => {
  return {
    userData: state.userData
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {}
}

export const Dashboard = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardContainer)
