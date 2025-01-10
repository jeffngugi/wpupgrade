import React from 'react'
import { Heading, HStack, Pressable } from 'native-base'
import NotifIcon from '../../../assets/svg/notification.svg'

const AccountHeader = () => {
  return (
    <HStack justifyContent="space-between" alignItems="center">
      <Heading fontSize="24px" color={'charcoal'}>
        Account
      </Heading>
      <Pressable padding="4px" paddingRight="0">
        {/* <NotifIcon color="#253545" /> */}
      </Pressable>
    </HStack>
  )
}

export default AccountHeader
