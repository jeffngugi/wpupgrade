import React from 'react'
import {
  HStack,
  Pressable,
  Box,
  Text,
  Divider,
  VStack,
  useToast,
} from 'native-base'
import { capitalize } from 'lodash'
import Clipboard from '@react-native-clipboard/clipboard'
import { openDialPad } from '~utils/app-utils'

type Props = {
  label: string
  value: string
  phone?: boolean
  copy?: boolean
  icon?: any
}

const PersonItem = ({ label, value, phone, copy, icon }: Props) => {
  const toast = useToast()
  const handleCall = () => {
    if (value === '-') {
      toast.show({ description: 'Phone number not available' })
      return
    }
    openDialPad(value)
  }

  const handleCopyEmail = () => {
    if (value === '-') {
      toast.show({ description: 'Personal email not available' })
      return
    }
    Clipboard.setString(value)
    toast.show({ description: `${value} copied` })
  }
  return (
    <Box>
      <VStack justifyContent="space-between" my="16px">
        <Box>
          <Text fontSize="14px" marginBottom="2px" color={'grey'}>
            {label}
          </Text>
        </Box>
        <HStack>
          <Text
            selectable={copy}
            fontSize={phone ? '16px' : '14px'}
            marginTop="2px"
            color="charcoal">
            {capitalize(value)}
          </Text>
          {copy ? (
            <Pressable
              // backgroundColor="green.10"
              ml={'auto'}
              paddingX="8px"
              borderRadius="4px"
              onPress={phone ? handleCall : handleCopyEmail}>
              {icon}
            </Pressable>
          ) : null}
        </HStack>
      </VStack>
      <Divider />
    </Box>
  )
}

export default PersonItem
