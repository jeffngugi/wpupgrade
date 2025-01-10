import React from 'react'
import { Box } from 'native-base'
import { ViewStyle } from 'react-native'

const ModalHandle = (p: { style?: ViewStyle }) => {
  return (
    <Box
      marginRight="auto"
      marginLeft="auto"
      width="36px"
      height="4px"
      backgroundColor="#D9D9D9"
      borderRadius="42px"
      style={[p.style ? p.style : {}]}
    />
  )
}

export default ModalHandle
