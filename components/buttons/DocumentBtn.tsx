import React from 'react'
import { Button, HStack, Text } from 'native-base'
import DocPickerIcon from '../../assets/svg/doc-picker.svg'

type DocumentButtonProps = {
  label: string
  onPress: () => void
}

const DocumentButton = ({ label, onPress }: DocumentButtonProps) => {
  return (
    <Button
      onPress={onPress}
      flexDirection="row"
      backgroundColor="rgba(214,241,202, 0.25)"
      alignSelf={'flex-start'}
      height="50px"
      _pressed={{ opacity: 0.6, backgroundColor: 'addDoc' }}>
      <HStack>
        <DocPickerIcon color="#62A446" />
        <Text color="green.70" fontFamily={'body'} ml="18px" fontSize={'16px'}>
          {label}
        </Text>
      </HStack>
    </Button>
  )
}

export default DocumentButton
