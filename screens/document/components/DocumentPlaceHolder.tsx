import { Box, HStack, Text, VStack } from 'native-base'
import React from 'react'
import DocSvg from '../../../assets/svg/doc-placeholder.svg'
import CloseIcon from '../../../assets/svg/close-icon.svg'

const DocumentPlaceHolder = ({
  name,
  amount,
  close,
  onClose,
}: {
  name: string
  amount?: string | number
  close?: boolean
  onClose?: () => void
}) => {
  return (
    <Box justifyContent={'flex-start'} alignItems="flex-start">
      <HStack
        borderColor="sea.50"
        borderRadius="4px"
        p="4px"
        background={'blue.50'}
        flexDirection={'row'}
        alignItems={'center'}
        borderWidth="1px">
        <Box maxW={'1/4'}>
          <DocSvg width={24} height={24} />
        </Box>
        <VStack maxW={'2/4'}>
          <Text
            mx={'8px'}
            overflow={'hidden'}
            fontSize={'16px'}
            color={'charcoal'}>
            {name}
          </Text>
          {amount && (
            <Text ml="12px" fontSize={'16px'} fontFamily={'heading'}>
              {amount}
            </Text>
          )}
        </VStack>
        <Box maxW={'1/4'}>
          {close && <CloseIcon width={16} height={16} onPress={onClose} />}
        </Box>
      </HStack>
    </Box>
  )
}

export default DocumentPlaceHolder
