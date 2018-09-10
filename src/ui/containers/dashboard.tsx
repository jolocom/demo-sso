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
    justifyContent: 'space-between'
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
  }
}

export class DashboardContainer extends React.Component<Props, State> {
  render() {
    const { givenName, familyName, did, email } = this.props.userData

    return (
      <div style={styles.container}>
        <div style={styles.banner} />
        <div style={styles.text}> Thank you for participating in our alpha release! </div>
        <div style={styles.text}> {`${givenName}, ${familyName}, ${did}, ${email}`}</div>
        <div style={styles.text}>You shared the following data with us:</div>

        <div style={styles.text}>The data you shared is only used for rendering purposes on this page.</div>
        <div style={styles.text}>And we will forget it as soon as you click the button below.</div>
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
