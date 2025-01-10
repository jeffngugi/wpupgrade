import React from 'react'
import { Box, Divider, HStack, Text, Badge } from 'native-base'
import ArrowRight from '~assets/svg/arrow-narrow-right.svg'
import ArrowLeft from '~assets/svg/arrow-narrow-left.svg'
import X from '~assets/svg/x.svg'
import UserAvatar from '~components/UserAvatar'
import { useMyProfile } from '~api/account'
import { ClockInOut } from '~declarations'

const AttemptItem = ({ item }: { item: ClockInOut }) => {
  const { data } = useMyProfile()
  let status = 'pending'
  let bVariant = 'pending'

  switch (item.status) {
    case 'pending':
      status = 'pending'
      bVariant = 'pending'
      break
    case 'success':
      status = 'success'
      bVariant = 'success'
      break
    case 'failed':
      status = 'failed'
      bVariant = 'failed'
      break
    default:
      status = 'pending'
      bVariant = 'pending'
  }

  return (
    <Box>
      <HStack alignItems="center" mx="16px" my="20px">
        <Box>
          <UserAvatar
            width="48px"
            height="48px"
            fallback="KB"
            url={data?.data?.profile_picture}
          />
        </Box>
        <Box ml="16px" my="10px" flex={1}>
          <HStack alignItems="center">
            {item.status === 'failed' ? (
              <X width={20} color="#F14B3B" />
            ) : item?.time_in ? (
              <ArrowRight color="#62A446" />
            ) : (
              <ArrowLeft color="#62A446" />
            )}

            <Text ml="10px" fontSize="16px" color={'charcoal'}>
              {item?.time_in ? 'Clock In' : 'Clock out'}
            </Text>
          </HStack>
          <Text color="charcoal" fontSize="16px">
            {item?.time_in || item?.time_out}
          </Text>
        </Box>
        <Box>
          <Badge variant={bVariant}>{status}</Badge>
        </Box>
      </HStack>
      <Divider />
    </Box>
  )
}

export default AttemptItem
