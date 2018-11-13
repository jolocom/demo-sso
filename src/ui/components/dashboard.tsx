import React from 'react'
import { AbstractedButton } from './landing'
import { CustomInput } from '../generic/CustomInput'

interface Props {
  did: string
  name: string
  inputValue: string
  handleUserInput: (e: React.FormEvent<HTMLInputElement>) => void
  handleButtonClick: (e: React.MouseEvent<HTMLElement>) => void
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
  }
}
export const DashboardComponent: React.SFC<Props> = props => {
  const { container, responseArea, welcomeMsg, button } = styles
  const { name, inputValue, handleButtonClick, handleUserInput } = props

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
        <AbstractedButton text="Receive" onClick={handleButtonClick} color={'primary'} />
      </div>
    </div>
  )
}
