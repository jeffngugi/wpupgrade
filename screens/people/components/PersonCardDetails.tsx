import React from 'react'
import { Box, Text } from 'native-base'
import UserAvatar from '../../../components/UserAvatar'
import { TColleague } from '../types'

const EwaHomeCardInfo = ({ item }: { item: TColleague }) => {
  return (
    <Box
      width="100%"
      borderRadius="18px"
      paddingTop="16px"
      paddingLeft="16px"
      position="absolute"
      bottom="0"
      left="0"
      right="0"
      top="0"
      bg={{
        linearGradient: {
          colors: ['#F2F3F3', '#EEF5EB90'],
          start: [0, 0],
          end: [1, 0],
        },
      }}>
      <UserAvatar fallback="WP" width="97px" url={item?.avatar} />
      <Box alignItems="center" mt="10px">
        <Text color="charcoal" fontSize="20px" fontWeight="bold">
          {item?.name ?? '-'}
        </Text>
        <Text color="charcoal" fontSize="16px" my="16px">
          {item?.job_title ?? '-'}
        </Text>

        {
          //Below has been commented since we will be getting more clarification of persons events from objects employees array
          /* <Box
          backgroundColor="white"
          mt="30px"
          borderRadius="16px"
          px="11px"
          py="6px">
          <Text>{'-'}</Text>
        </Box> */
        }
      </Box>
    </Box>
  )
}

export default EwaHomeCardInfo
