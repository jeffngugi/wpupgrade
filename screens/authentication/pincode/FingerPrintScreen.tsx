import React, { useEffect, useState } from 'react'
import { Box, Text } from 'native-base'
import FingerPrintSvg from '~assets/svg/fingerprint.svg'
import FaceIdSvg from '~assets/svg/faceId-large.svg'
import SubmitButton from '~components/buttons/SubmitButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import OutlineButton from '~components/buttons/OutlineButton'
import { useDispatch, useSelector } from 'react-redux'
import {
  setBiometricEnabled,
  setFaceIdEnabled,
  setFingerPrintEnabled,
  skipBiometrics,
} from '~store/actions/Application'
import { setItem } from '~storage/device-storage'
import { Platform } from 'react-native'
import { supportsFaceId, supportsFingerPrint } from '~utils/biometric.util'
import { State } from '~declarations'
import WarningModal from '~components/modals/WarningModal'
import { isEnrolledAsync } from 'expo-local-authentication'

const FingerPrintScreen = () => {
  const dispatch = useDispatch()
  const [faceIdSupported, setFaceIdSupported] = useState<boolean>(false)
  const [biometricSupported, setBiometricSupported] = useState<boolean>(false)
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState<boolean>(false)
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>('')
  const { lockPinAvailable } = useSelector((state: State) => state.application)

  useEffect(() => {
    const checkFaceId = async () => {
      const faceId = await supportsFaceId()
      setFaceIdSupported(faceId)
    }
    const checkBiometric = async () => {
      const biometric = await supportsFingerPrint()
      setBiometricSupported(biometric)
    }
    const checkBiometricEnrolled = async () => {
      const biometricEnrolled = await isEnrolledAsync()
      setIsBiometricEnrolled(biometricEnrolled)
    }
    checkFaceId()
    checkBiometric()
    checkBiometricEnrolled()
  }, [])

  const onPressFingerPrint = async () => {
    if (!biometricSupported) {
      setShowErrorModal(true)
      setErrorMessage(
        'Biometrics are not supported on this device. Please use a pin to unlock the app',
      )
      return
    }
    if (!isBiometricEnrolled) {
      setShowErrorModal(true)
      setErrorMessage(
        'Please set up your biometric authentication in your device settings',
      )
      return
    }

    setShowErrorModal(false)
    setErrorMessage('')
    dispatch(setBiometricEnabled(true))
    dispatch(setFingerPrintEnabled(true))
    if (lockPinAvailable) {
      setItem('biometricEnabled', true)
    }
  }

  const onPressFaceId = async () => {
    if (!supportsFaceId()) {
      return
    }
    if (!isBiometricEnrolled) {
      setShowErrorModal(true)
      setErrorMessage(
        'Please set up your biometric authentication in your device settings',
      )
      return
    }

    setShowErrorModal(false)
    setErrorMessage('')

    dispatch(setFingerPrintEnabled(true))
    dispatch(setFaceIdEnabled(true))
    if (lockPinAvailable) {
      setItem('faceIdEnabled', true)
    }
  }

  const onPressSkipBiometrics = () => {
    dispatch(skipBiometrics(true))
    setItem('skipBioMetrics', 'true')
  }

  const faceIdSupportedIos = Platform.OS === 'ios' && faceIdSupported

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        marginX="10px"
        flex={1}>
        <Box marginY="10px">
          {Platform.OS === 'ios' && faceIdSupported ? (
            <FaceIdSvg width={140} height={140} color="#62A446" />
          ) : (
            <FingerPrintSvg width={140} height={140} color="#62A446" />
          )}
        </Box>
        <Text
          fontFamily={'heading'}
          fontSize="20px"
          color="charcoal"
          textAlign="center">
          Sign in with{' '}
          {Platform.OS === 'ios' && faceIdSupported ? 'Face ID' : 'Touch Id'}
        </Text>

        <Text
          textAlign="center"
          marginY="6px"
          fontSize="16px"
          fontFamily={'body'}>
          Use your{' '}
          {Platform.OS === 'ios' && faceIdSupported ? 'face id' : 'fingerprint'}{' '}
          to unlock the app. You will be asked to set up your pin before you can
          use this feature.
        </Text>
      </Box>
      <Box mx={'16px'}>
        {biometricSupported && !faceIdSupportedIos ? (
          <SubmitButton
            title="Use Fingerprint"
            onPress={() => onPressFingerPrint()}
            mb={'10px'}
          />
        ) : null}
        {Platform.OS === 'ios' && faceIdSupported ? (
          <SubmitButton
            title="Use Face ID"
            onPress={() => onPressFaceId()}
            mb={'10px'}
          />
        ) : null}

        <OutlineButton
          label="Skip this step"
          onPress={() => onPressSkipBiometrics()}
          pVertical={12}
        />
        <Box height="40px" />
        {showErrorModal && (
          <WarningModal
            title="Error"
            description={errorMessage || 'An error occurred'}
            isVisible={showErrorModal}
            hideModal={() => setShowErrorModal(false)}
          />
        )}
      </Box>
    </SafeAreaView>
  )
}

export default FingerPrintScreen
