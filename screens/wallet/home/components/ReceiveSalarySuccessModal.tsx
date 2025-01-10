import React from 'react'
import { Box, HStack, Text, Button } from 'native-base'
import XIcon from '~assets/svg/wallet-x.svg'
import { Pressable } from 'react-native'
import SwipableModal from '~components/modals/SwipableModal'
import OptInImg from '~assets/svg/optin-success.svg'

type Props = {
  isOpen: boolean
  hideModal: () => void
}

const ReceiveSalarySuccessModal = (p: Props) => {
  const closeModal = () => {
    p.hideModal()
  }

  return (
    <SwipableModal isOpen={p.isOpen} onHide={p.hideModal}>
      <Box paddingX="16px" paddingBottom="30px" top="-20px">
        <HStack mb="10px" alignItems="center" justifyContent="space-between">
          <Box ml="auto">
            <Pressable onPress={closeModal}>
              <XIcon color="#253545" />
            </Pressable>
          </Box>
        </HStack>
        <Box alignItems={'center'} mb="20px">
          <OptInImg />
        </Box>

        <Box alignItems={'center'} mb="20px">
          <Text
            color="charcoal"
            fontFamily="heading"
            textAlign={'center'}
            marginTop="10px"
            mb="12px"
            fontSize="24px"
            lineHeight={'30px'}>
            Opt in Successful
          </Text>
          <Text
            color="charcoal"
            fontFamily="body"
            textAlign={'center'}
            marginTop="10px"
            mb="12px"
            fontSize="18px"
            lineHeight={'30px'}>
            You've successfully opted to receive your salary directly to your
            wallet. Your future payments will now be faster and more convenient.
          </Text>
        </Box>
        <HStack justifyContent="space-around" mb="20px">
          <Button
            onPress={closeModal}
            backgroundColor="green.50"
            w={'48%'}
            _text={{ color: 'white', fontSize: '16px' }}>
            Close
          </Button>
        </HStack>
      </Box>
    </SwipableModal>
  )
}

export default ReceiveSalarySuccessModal
