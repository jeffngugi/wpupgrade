import React from 'react'
import { Badge, Box, HStack, Text, VStack } from 'native-base'
import ExpenseIcon from '~assets/svg/expenses.svg'
import { Pressable } from 'native-base'
import ArrowRightGreenIcon from '~assets/svg/arrow-right-green.svg'

type DocumentButtonProps = {
  label: string
  onPress: () => void
  numberOfFiles?: number
}

const DocumentBoxButton = ({ label, onPress, numberOfFiles }: DocumentButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      backgroundColor="green.20"
      _pressed={{ opacity: 0.6, backgroundColor: 'addDoc' }}
      px={'8px'}
      py={'16px'}
      borderRadius={'8px'}
    >
      <HStack>
        <ExpenseIcon color="#62A446" />
        <VStack maxWidth={'65%'}>
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
            Upload one or multiple receipts for this expense
          </Text>
        </VStack>
        <Box justifyContent={'center'} alignItems={'center'} pl={'10px'}>
          <ArrowRightGreenIcon />
        </Box>
      </HStack>

    </Pressable>
  )
}

export default DocumentBoxButton
