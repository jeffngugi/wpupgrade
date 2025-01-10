import React from 'react'
import { Box } from 'native-base'

type BigDotProps = {
  bgColor?: string
}

const BigDot = ({ bgColor }: BigDotProps) => {
  return (
    <Box
      width="4px"
      height="4px"
      borderRadius="2px"
      mx="2px"
      my={'auto'}
      backgroundColor={bgColor ? bgColor : 'grey'}
      lineHeight={'16px'}
    />
  )
}

export default BigDot
