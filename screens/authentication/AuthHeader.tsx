import React from 'react'
import { HStack, Heading, Pressable } from 'native-base'
import BackIcon from '../../assets/svg/back-chev.svg'

type AuthHeaderProps = {
  onPress: () => void
  title?: string
  cancel?: boolean
}

const AuthHeader = ({ onPress, title }: AuthHeaderProps) => {
  return (
    <HStack alignItems="center">
      <Pressable paddingRight="10px" paddingY="10px" onPress={onPress}>
        <BackIcon color="black" width={20} height={20} />
      </Pressable>
      {title ? (
        <Heading marginTop="20px" marginBottom="18px" ml="40px">
          {title}
        </Heading>
      ) : null}
    </HStack>
  )
}

export default AuthHeader
