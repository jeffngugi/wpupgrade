import React from 'react'
import { HStack, Heading, Pressable } from 'native-base'
import X from '~assets/svg/x.svg'

type Props = {
  title: string
  onPress: () => void
}
const ScanQRHeader = ({ title, onPress }: Props) => {
  return (
    <HStack alignItems="center" py="20px" zIndex={2000}>
      <Pressable onPress={onPress}>
        <X color="white" width={24} height={24} />
      </Pressable>
      <Heading ml="70px" color="white" fontSize="24px">
        {title}
      </Heading>
    </HStack>
  )
}

export default ScanQRHeader
