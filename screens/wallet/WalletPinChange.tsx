import React, { useState } from 'react'
import ScreenContainer from '~components/ScreenContainer'
import ScreenHeader from '~components/ScreenHeader'
import { WalletPinTextInput } from './components/WalletPinInput'
import { Box, Button, Heading } from 'native-base'
import { useChangeWalletPin, useGetWalletUser } from '~api/wallet'
import WalletCommonModal from './components/modals/WalletCommonModal'
import LockIcon from '~assets/svg/wallet-pin-success.svg'
import { WalletRoutes } from '~types'

const WalletPinChange = ({ navigation }) => {
  const { data: walletData, isLoading } = useGetWalletUser()
  const { mutate, isLoading: changingPin } = useChangeWalletPin()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [visible, setVisible] = useState(false)

  const headings = [
    'Current Wallet PIN',
    'New Wallet PIN',
    'Confirm Wallet PIN',
  ]

  const handleConfirmCurrentPin = () => {
    if (currentPin.length < 4) {
      return
    }
    setStep(2)
  }

  const handleSetNewPin = () => {
    if (newPin.length < 4) {
      return
    }
    setStep(3)
  }

  const handleConfirmNewPinsMatches = () => {
    if (newPin !== confirmPin) {
      return
    }

    const submitData = {
      user_uuid: walletData.data.uuid,
      old_password: currentPin,
      new_password: newPin,
    }

    mutate(submitData, {
      onSuccess: () => {
        setVisible(true)
      },
    })
  }

  const handleContinue = () => {
    setVisible(false)
    setTimeout(() => navigation.navigate(WalletRoutes.Setting), 500)
  }

  const handleNext = () => {
    switch (step) {
      case 1:
        handleConfirmCurrentPin()
        break
      case 2:
        handleSetNewPin()
        break
      case 3:
        handleConfirmNewPinsMatches()
        break
      default:
        break
    }
  }

  return (
    <ScreenContainer>
      <ScreenHeader
        title={headings[step - 1]}
        onPress={() => navigation.goBack()}
      />
      <Box marginTop="40px" flex={1}>
        {step === 1 ? (
          <WalletPinTextInput value={currentPin} setValue={setCurrentPin} />
        ) : (
          <Box />
        )}
        {step === 2 ? (
          <WalletPinTextInput value={newPin} setValue={setNewPin} />
        ) : (
          <Box />
        )}
        {step === 3 ? (
          <WalletPinTextInput value={confirmPin} setValue={setConfirmPin} />
        ) : (
          <Box />
        )}
      </Box>
      <Button onPress={handleNext} isLoading={changingPin}>
        Send
      </Button>
      <WalletCommonModal visible={visible} setVisible={setVisible}>
        <Box flex={1} alignItems="center" justifyContent="center">
          <Box my="15px">
            <LockIcon />
          </Box>
          <Heading color="white" fontSize="24px" textAlign="center">
            You've changed your PIN
          </Heading>
        </Box>

        <Button
          backgroundColor="#387E1B"
          onPress={handleContinue}
          isLoading={changingPin}>
          Done
        </Button>
      </WalletCommonModal>
    </ScreenContainer>
  )
}

export default WalletPinChange
