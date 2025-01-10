import React, { useCallback } from 'react'
import { Box, HStack, Text, Button } from 'native-base'
import XIcon from '~assets/svg/wallet-x.svg'
import Wallet3D1 from '~assets/svg/wallet-3d-1.svg'
import { Pressable } from 'react-native'
import SwipableModal from '~components/modals/SwipableModal'

import { setItem } from '~storage/device-storage'

type Props = {
  isOpen: boolean
  hideModal: () => void
  handleClick?: () => void
  isLoading?: boolean
}

const ReceiveSalaryModal = (p: Props) => {
  const closeModal = () => {
    p.hideModal()
  }

  const dismissWalletModal = async () => {
    await setItem('isWalletModalDismissed', 'true')
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
          <Wallet3D1 />
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
            Get Paid Directly into your Wallet
          </Text>
          <Text
            color="charcoal"
            fontFamily="body"
            textAlign={'center'}
            marginTop="10px"
            mb="12px"
            fontSize="18px"
            lineHeight={'30px'}>
            Opt to receive your salary directly to your Workpay wallet for
            faster, more convenient access to your funds.
          </Text>
        </Box>
        <HStack justifyContent="space-between" mb="20px">
          <Button
            onPress={dismissWalletModal}
            backgroundColor="white"
            borderColor="green.50"
            borderWidth="1px"
            w={'48%'}
            _text={{ color: 'green.50', fontSize: '16px' }}>
            Later
          </Button>
          <Button
            isLoading={p.isLoading}
            onPress={p.handleClick}
            backgroundColor="green.50"
            w={'48%'}
            _text={{ color: 'white', fontSize: '16px' }}>
            Enable
          </Button>
        </HStack>
      </Box>
    </SwipableModal>
  )
}

export default ReceiveSalaryModal
