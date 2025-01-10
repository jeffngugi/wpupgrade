import { StyleSheet } from 'react-native'
import React from 'react'
import { documentOption } from './modals/DocumentPickerModal'
import { Button, HStack, Text } from 'native-base'

const DocOption = ({ text, onPress, Icon }: documentOption) => (
  <Button
    variant={'url'}
    justifyContent="flex-start"
    onPress={onPress}
    marginY="5px">
    <HStack alignItems="center">
      <Icon width={24} height={24} style={styles.optionIcon} />
      <Text marginLeft="4px" fontSize={'16px'} color={'charcoal'}>
        {text}
      </Text>
    </HStack>
  </Button>
)

export default DocOption

const styles = StyleSheet.create({
  optionIcon: {
    marginRight: 10,
    color: '#536171',
  },
})
