import { Box, Divider, HStack, Pressable, Text } from 'native-base'
import React from 'react'
import PlusIcon from '../../../assets/svg/plus.svg'

type Props = {
  title: string
  onPress: () => void
  edit?: boolean
  hidden?: boolean
}

const ContactItemHead = ({ title, onPress, edit, hidden }: Props) => {
  return (
    <Box>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        marginBottom="8px">
        <Text
          color="charcoal"
          fontSize="18px"
          fontWeight="500"
          fontFamily={'heading'}>
          {title}
        </Text>
        {hidden ? (
          <Box />
        ) : (
          <Pressable
            flexDirection="row"
            alignItems="center"
            backgroundColor="green.10"
            paddingY="4px"
            paddingX="8px"
            borderRadius="4px"
            onPress={onPress}>
            <PlusIcon color="#62A446" />
            <Text
              marginLeft="8px"
              color="green.50"
              fontFamily={'heading'}
              fontSize={'16px'}>
              {'Add'}
            </Text>
          </Pressable>
        )}
      </HStack>
      <Divider />
    </Box>
  )
}

export default ContactItemHead
