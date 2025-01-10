import React, { useEffect } from 'react'
import SwipableModal from '~components/modals/SwipableModal'
import { windowHeight } from '~utils/appConstants'
import { Box, HStack, Pressable, Button, Text } from 'native-base'
import { WalletPinTextInput } from '../WalletPinInput'
import XIcon from '~assets/svg/wallet-x.svg'
import SubmitButton from '~components/buttons/SubmitButton'

type Props = {
  confirmModal: boolean
  setConfirmModal: (b: boolean) => void
  pin: string
  setPin: (text: string) => void
  isLoading?: boolean
  btnTitle?: string
  handlePress: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined,
  ) => Promise<void>
}
const WalletPinModal = (p: Props) => {
  return (
    <SwipableModal
      androidScrollDisabled
      isOpen={p.confirmModal}
      onHide={() => p.setConfirmModal(false)}
      onBackdropPress={() => p.setConfirmModal(false)}>
      <Box px="16px" flex={1} height={windowHeight * 0.7} paddingBottom="40px">
        <Box flex={1}>
          <HStack alignItems="center" mb="24px">
            <Pressable onPress={() => p.setConfirmModal(false)}>
              <XIcon color="#253545" />
            </Pressable>
            <Text color="charcoal" fontSize="20px" lineHeight="30px" ml="68px">
              Enter your wallet pin
            </Text>
          </HStack>
          <WalletPinTextInput value={p.pin} setValue={p.setPin} />
        </Box>
        <SubmitButton
          isLoading={p.isLoading}
          mb="0"
          onPress={p.handlePress}
          title={p.btnTitle ?? 'Continue'}
        />
      </Box>
    </SwipableModal>
  )
}

export default WalletPinModal
