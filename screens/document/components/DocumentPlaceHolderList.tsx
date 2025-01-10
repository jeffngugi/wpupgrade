import { Box, HStack, Text, VStack } from 'native-base'
import React from 'react'
import DocSvg from '../../../assets/svg/doc-placeholder.svg'
import CloseIcon from '../../../assets/svg/close-icon.svg'

const DocumentPlaceHolderList = ({
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
    <HStack
      borderColor="sea.50"
      borderRadius="4px"
      p="4px"
      background={'blue.50'}
      alignItems={'center'}
      borderWidth="1px">
      <DocSvg width={24} height={24} />
      <VStack mx={'10px'} w={'70%'}>
        <Text
          isTruncated
          overflow={'hidden'}
          fontSize={'16px'}
          color={'charcoal'}>
          {name}
        </Text>
        {amount && (
          <Text fontSize={'16px'} fontFamily={'heading'} color={'charcoal'}>
            {amount}
          </Text>
        )}
      </VStack>

      {close && (
        <Box maxW={'1/4'}>
          <CloseIcon width={16} height={16} onPress={onClose} />
        </Box>
      )}
    </HStack>
  )
}

export default DocumentPlaceHolderList
