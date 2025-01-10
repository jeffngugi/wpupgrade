import React from 'react'
import { Box, IBoxProps } from 'native-base'

interface Props extends IBoxProps {
  children: React.ReactNode
}

const WalletListBox = ({ children, ...rest }: Props) => {
  return (
    <Box
      paddingY="2px"
      borderWidth="1px"
      borderColor="#E3E9EC"
      borderRadius="8px"
      {...rest}>
      {children}
    </Box>
  )
}

export default WalletListBox
