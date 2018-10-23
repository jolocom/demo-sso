import { MuiThemeProvider, createMuiTheme, Input } from '@material-ui/core'
import React from 'react'

interface Props {
  value: string
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const CustomInput: React.SFC<Props> = props => {
  return (
    <MuiThemeProvider
      theme={createMuiTheme({
        palette: {
          primary: { main: '#fff' },
          text: { primary: '#fff' }
        }
      })}
    >
      <Input
        value={props.value}
        onChange={props.handleInput}
        style={{ flex: 0.95, flexGrow: 1 }}
        placeholder={'answer'}
        fullWidth
        multiline
      />
    </MuiThemeProvider>
  )
}
