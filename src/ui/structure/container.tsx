import * as React from 'react'
import { ReactNode } from 'react'

// const styles = StyleSheet.create({
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100%',
//     width: '100%',
//     padding: '5%'
//   }
// })

interface Props {
  children: ReactNode;
}

export const Container : React.SFC<Props> = (props) => {
  return(
    <div className="container">
      {props.children}
    </div>
  )
}
