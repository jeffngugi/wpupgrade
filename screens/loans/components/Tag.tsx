import React from 'react'
import { Box, Text } from 'native-base'

const Tag = ({ tagName }: { tagName: string }) => {
  return (
    <Box
      borderWidth={1}
      borderColor="skeletonDark"
      backgroundColor="#F9FAFA"
      paddingX="8px"
      paddingY="2px"
      borderRadius="32px"
      ml="8px">
      <Text>{tagName}</Text>
    </Box>
  )
}

export default Tag
