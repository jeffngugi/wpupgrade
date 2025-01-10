import React from 'react'
import { Box, Divider, Text } from 'native-base'

const ItemsHead = ({ title }: { title: string }) => {
  return (
    <>
      {title ? (
        <Box marginX="16px" marginTop={'32px'}>
          <Text color="charcoal" fontSize="16px" fontFamily={'heading'}>
            {title}
          </Text>
          <Divider marginTop="12px" />
        </Box>
      ) : null}
    </>
  )
}

export default ItemsHead
