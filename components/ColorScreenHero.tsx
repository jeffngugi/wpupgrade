import React from 'react'
import { Box } from 'native-base'

const ColorScreenHero = ({
  children,
  padding,
}: {
  children: React.ReactNode
  padding?: boolean
}) => {
  return (
    <Box
      backgroundColor="green.10"
      paddingX={padding ? '16px' : 0}
      paddingBottom="35px">
      {children}
    </Box>
  )
}

export default ColorScreenHero
