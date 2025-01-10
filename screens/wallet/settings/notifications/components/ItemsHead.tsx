import React from 'react'
import { Box, Divider, Text } from 'native-base'

const ItemsHead = ({
  title,
  description,
}: {
  title: string
  description?: string
}) => {
  return (
    <>
      {title ? (
        <Box marginX="16px" marginTop={'32px'}>
          <Text color="charcoal" fontSize="18px" fontFamily={'heading'}>
            {title}
          </Text>
          <Text
            color="grey"
            fontSize="14px"
            fontFamily={'body'}
            marginTop={'4px'}>
            {description}
          </Text>
        </Box>
      ) : null}
    </>
  )
}

export default ItemsHead
