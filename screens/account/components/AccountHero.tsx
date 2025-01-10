import React from 'react'
import { Box, HStack, Heading, Text } from 'native-base'
import UserAvatar from '../../../components/UserAvatar'
import { useMyProfile } from '~api/account'

const AccountHero = () => {
  const { data } = useMyProfile()

  const name = `${data?.data?.employee_name ?? '-'}`
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')

  return (
    <Box paddingBottom="21px" paddingTop="16px">
      <HStack alignItems="center">
        <UserAvatar
          fallback={initials}
          url={data?.data?.profile_picture}
          width="56px"
        />
        <Box ml="16px" flex={1}>
          <Heading fontSize="18px" color="charcoal" maxWidth={'90%'}>
            {data?.data?.employee_name ?? '-'}
          </Heading>
          <Text color="green.50" fontSize={'16px'} maxWidth={'90%'}>
            {data?.data?.address?.email ?? '-'}
          </Text>
        </Box>
      </HStack>
    </Box>
  )
}

export default AccountHero
