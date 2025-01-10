// import { StyleSheet, Text, View } from 'react-native'
import { Box, Divider, HStack, Pressable, Text } from 'native-base'
import React from 'react'
import MoreIcon from '../../../assets/svg/more-vertical.svg'

type Props = {
  name: string
  contact: string
  onPress: () => void
  edit?: boolean
}

const ContactItem = ({ name, contact, onPress }: Props) => {
  return (
    <Pressable onPress={onPress}>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        paddingY="16px">
        <Box>
          <Text fontSize="16px" color="charcoal">
            {name}
          </Text>
          <Text fontSize="14px" marginTop="2px" color={'grey'}>
            {contact}
          </Text>
        </Box>
        <MoreIcon color="#536171" width={'20px'} />
      </HStack>
      <Divider />
    </Pressable>
  )
}

export default ContactItem
