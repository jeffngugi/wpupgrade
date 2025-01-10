import React from 'react'
import { Box } from 'native-base'

type BigDotProps = {
  bgColor?: string
}

const ColorDot = ({ bgColor }: BigDotProps) => {
  return (
    <Box
      width="8px"
      height="8px"
      borderRadius="8px"
      mx="2px"
      my={'auto'}
      backgroundColor={bgColor ? bgColor : 'grey'}
      lineHeight={'16px'}
    />
  )
}

export default ColorDot
