import { Box, HStack, Text, VStack } from 'native-base'
import React from 'react'
import CloseIcon from '~assets/svg/close-icon.svg'
import CloseIconGreen from '~assets/svg/close-icon-green.svg'
import FileGreenIcon from '~assets/svg/file-green.svg'

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
        borderColor="#BBBFC4"
        borderRadius="4px"
        p="18px"
        background={'green.10'}
        justifyContent={'space-between'}
        flexDirection={'row'}
        alignItems={'center'}
        borderWidth="1px">
        <Box >
          <FileGreenIcon width={32} height={32} />
        </Box>
        <VStack width={'85%'}>
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
        <Box >
          {close && <CloseIconGreen width={16} height={16} onPress={onClose} />}
        </Box>
      </HStack>
    </Box>
  )
}

export default DocumentPlaceHolder
