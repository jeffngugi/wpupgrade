import React from 'react'
import { Badge, Box, Center, HStack, Text, VStack } from 'native-base'
import ExpenseIcon from '~assets/svg/expenses.svg'
import { Pressable } from 'native-base'
import ArrowRightGreenIcon from '~assets/svg/arrow-right-green.svg'
import FileUploadIcon from '~assets/svg/file-upload-icon.svg'

type DocumentButtonProps = {
  label: string
  onPress: () => void
  numberOfFiles?: number
}

const FileUploadButton = ({ label, onPress, numberOfFiles }: DocumentButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      backgroundColor="white"
      _pressed={{ opacity: 0.6, backgroundColor: 'addDoc' }}
      px={'8px'}
      py={'16px'}
      borderWidth={'2px'}
      borderStyle={'dashed'}
      borderRadius={'8px'}
    >
      <HStack>
        <Center px={'10px'}>
          <FileUploadIcon color="#62A446" />
        </Center>
        <VStack maxWidth={'75%'}>
          <HStack justifyContent={'space-between'}>
            <Text color="charcoal" fontFamily={'heading'} ml="18px" fontSize={'16px'}>
              {label}
            </Text>

            {numberOfFiles ? <Box background="green.50" borderRadius="19px" w="20px" h="20px"
              justifyContent="center" alignItems="center" ml="8px">
              <Text color="white" fontSize="12px" fontFamily="heading">
                {numberOfFiles}
              </Text>
            </Box>
              : null}
          </HStack>
          <Text color="grey" fontFamily={'body'} ml="18px" fontSize={'14px'} >
            Accepts .pdf, .png, ,jpeg, .gif and other image formats
          </Text>
        </VStack>

      </HStack>

    </Pressable>
  )
}

export default FileUploadButton
