import React from 'react'
import { AbstractedButton } from './landing'
import { CustomInput } from '../generic/CustomInput'

interface Props {
  did: string
  name: string
  inputValue: string
  handleUserInput: (e: React.FormEvent<HTMLInputElement>) => void
  handleIssueCredential: (e: React.MouseEvent<HTMLElement>) => void
  handleRequestPayment: (e: React.MouseEvent<HTMLElement>) => void
}

const styles = {
  container: {
    height: '100vh',
    backgroundColor: 'black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'white',
    fontSize: '24px',
    fontWeight: 300
  } as React.CSSProperties,
  responseArea: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '3%'
  } as React.CSSProperties,
  welcomeMsg: {
    marginTop: '5%'
  },
  button: {
    marginBottom: '3%',
    width: '15%'
  },
  paymentArea: {
    paddingTop: '10%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  } as React.CSSProperties
}

export const DashboardComponent: React.SFC<Props> = props => {
  const { container, responseArea, welcomeMsg, button, paymentArea } = styles
  const { name, inputValue, handleIssueCredential, handleUserInput, handleRequestPayment } = props

  return (
    <div style={container}>
      <span style={welcomeMsg}>Welcome, {name}.</span>
      <div>
        <div>Q: Do you think we can handle the responsibility of managing our own data?</div>
        <div style={responseArea}>
          <div style={{ flex: 0.05 }}>A:</div>
          <CustomInput value={inputValue} handleInput={handleUserInput} />
        </div>
      </div>
      <div style={button}>
        <AbstractedButton
          text="Get Claim"
          onClick={handleIssueCredential}
          imageName={'JO_icon.svg'}
          color={'primary'}
        />
      </div>
      <div style={welcomeMsg}>Buy the limited edition Jolocom t-shirt for 0.033 ETH</div>
        <div style={button}>
          <AbstractedButton
            text="Buy"
            onClick={handleRequestPayment}
            imageName={`JO_icon.svg`}
            color={'primary'}
          />
      </div>
    </div>
  )
}
