import React from 'react'
import { Box, IBoxProps } from 'native-base'

interface Props extends IBoxProps {
  children: React.ReactNode
}

const ScreenContainer = ({ children, ...rest }: Props) => {
  return (
    <Box safeArea flex={1} backgroundColor="white" px="16px" {...rest}>
      {children}
    </Box>
  )
}

export default ScreenContainer
