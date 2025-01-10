import React, { useEffect, useState } from 'react'
import { Box, Text } from 'native-base'
import FingerPrintSvg from '~assets/svg/fingerprint.svg'
import SubmitButton from '~components/buttons/SubmitButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import OutlineButton from '~components/buttons/OutlineButton'
import { useDispatch, useSelector } from 'react-redux'
import {
  appUnlock,
  setBiometricEnabled,
  setFaceIdEnabled,
  setFingerPrintEnabled,
  setLockPinAvailable,
  setSkipPinSetUp,
  skipBiometrics,
} from '~store/actions/Application'
import { State } from '~declarations'
import { setItem } from '~storage/device-storage'
import { Platform } from 'react-native'
import PinLandingIcon from '~assets/svg/pin-landing.svg'
import { useNavigation } from '@react-navigation/native'
import { AccountsRoutes } from '~types'

type Props = {
  pinSetStep: number
  setPinSetStep: (step: number) => void
}

const PinLandingScreen = ({ pinSetStep, setPinSetStep }: Props) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const onPressPin = () => {
    setPinSetStep(2)
  }

  const onPressSkipPin = () => {
    dispatch(setSkipPinSetUp(true))
    navigation.navigate('HomeTabNavigator', { screen: 'Home' })
    dispatch(appUnlock())
    dispatch(setLockPinAvailable(false))
    setItem('lockPinAvailable', false)
    dispatch(setBiometricEnabled(false))
    dispatch(setFingerPrintEnabled(false))
    dispatch(setFaceIdEnabled(false))
    setItem('biometricEnabled', false)
    setItem('faceIdEnabled', false)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box
        alignItems="center"
        justifyContent="center"
        backgroundColor="white"
        textAlign="center"
        marginX="10px"
        flex={1}>
        <Box marginY="10px">
          <PinLandingIcon width={140} height={140} color="#387E1B" />
        </Box>
        <Text
          fontFamily={'heading'}
          fontSize="20px"
          color="charcoal"
          textAlign="center">
          Set your pin
        </Text>

        <Text
          textAlign="center"
          marginY="6px"
          fontSize="16px"
          fontFamily={'body'}>
          Improve security by setting your pin
        </Text>
      </Box>
      <Box mx={'16px'}>
        <SubmitButton
          title="Set your pin"
          onPress={() => onPressPin()}
          mb={'10px'}
        />

        <OutlineButton
          label="Do this later"
          onPress={() => onPressSkipPin()}
          pVertical={12}
        />
        <Box height="40px" />
      </Box>
    </SafeAreaView>
  )
}

export default PinLandingScreen
