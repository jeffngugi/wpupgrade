import React from 'react'
import { Box } from 'native-base'

const ListContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box flex={1} px="16px" backgroundColor="white" pt="10px">
      {children}
    </Box>
  )
}

export default ListContainer
