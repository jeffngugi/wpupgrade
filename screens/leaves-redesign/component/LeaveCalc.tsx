import React from 'react'
import { Box, IBoxProps } from 'native-base'

const LeaveCalc = ({ children, ...rest }: { children: React.ReactNode } & IBoxProps) => {
  return (
    <Box
      my="8px"
      px="20px"
      py="10px"
      borderRadius="4px"
      backgroundColor="sea.10"
      borderColor="sea.50"
      borderWidth="1px"
      {...rest}
    >
      {children}
    </Box>
  )
}

export default LeaveCalc
