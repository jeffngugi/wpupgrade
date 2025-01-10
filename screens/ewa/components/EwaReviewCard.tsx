import { Box, HStack, Text, Heading, Divider } from 'native-base'
import React from 'react'

type Props = {
  label: string
  value: string
}

const EwaReviewCard = ({ label, value }: Props) => {
  return (
    <Box marginTop="22px">
      <HStack
        justifyContent="space-between"
        marginBottom="20px"
        alignItems="center">
        <Text fontSize={'14px'} color={'skeletonBlack'}>
          {label}
        </Text>
        <Heading fontSize="16px" color={'black1'}>
          {value}
        </Heading>
      </HStack>
      <Divider />
    </Box>
  )
}

export default EwaReviewCard
