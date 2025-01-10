import React from 'react'
import { Box } from 'native-base'

const LoanCalc = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      my="8px"
      px="20px"
      py="10px"
      borderRadius="4px"
      backgroundColor="sea.10"
      borderColor="sea.50"
      borderWidth="1px">
      {children}
    </Box>
  )
}

export default LoanCalc
