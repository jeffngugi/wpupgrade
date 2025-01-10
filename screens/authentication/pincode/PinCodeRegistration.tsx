import React, { useState, useEffect } from 'react'
import { Box, Heading, ScrollView, Text } from 'native-base'
import { Keyboard } from 'react-native'
import { useTranslation } from 'react-i18next'
import NumberKeypad from '~components/NumberKeypad'
import { storeSecureItem } from '~storage/secureStore'
import { ApplicationAction, State } from '~declarations'
import { useDispatch, useSelector } from 'react-redux'
import {
  appUnlock,
  setBiometricEnabled,
  setFaceIdEnabled,
  setLockPin,
  setLockPinAvailable,
  setLockingEnabled,
  skipBiometrics,
} from '~store/actions/Application'
import PinTextInput from './PinTextInput'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import { setItem } from '~storage/device-storage'
import { useNavigation } from '@react-navigation/native'

export type Props = {
  errorMessage: string | undefined
  setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>
  enableBiometrics?: boolean
  enableFaceId?: boolean
}

const PinCodeRegistration = ({
  errorMessage,
  setErrorMessage,
  enableBiometrics,
  enableFaceId,
}: Props) => {
  const navigation = useNavigation()
  const dispatch: React.Dispatch<ApplicationAction> = useDispatch()
  const { fingerprintEnabled, biometricEnabled, faceIdEnabled, locked } =
    useSelector((state: State) => state.application)

  const { t } = useTranslation('lockscreen')
  const [pin1, setPin1] = useState('')
  const [pin2, setPin2] = useState('')
  const [step1, setStep1] = useState(true)

  const CELL_COUNT = 4

  useEffect(() => {
    Keyboard.dismiss()
  }, [])

  const isValidPin2 = (pin: string) => {
    return pin1 === pin
  }

  const pinSetHandler = (pin1: string) => {
    storeSecureItem('pin', pin1)
  }

  useEffect(() => {
    if (pin1.length === CELL_COUNT) {
      requestAnimationFrame(() => {
        setErrorMessage(undefined)
        setStep1(false)
      })
    }
  }, [pin1])

  useEffect(() => {
    if (pin2.length === CELL_COUNT) {
      requestAnimationFrame(() => onPin2Complete())
    }
  }, [pin2])

  console.log(
    biometricEnabled,
    enableBiometrics,
    'biometricEnabled',
    enableFaceId,
  )

  const onPin2Complete = async () => {
    if (isValidPin2(pin2)) {
      console.log(biometricEnabled, enableBiometrics, 'biometricEnabled')
      if (biometricEnabled || enableBiometrics) {
        console.log(fingerprintEnabled || enableBiometrics)
        dispatch(setBiometricEnabled(fingerprintEnabled || enableBiometrics))
        setItem('biometricEnabled', fingerprintEnabled || enableBiometrics)
      }
      if (faceIdEnabled || enableFaceId) {
        dispatch(setFaceIdEnabled(faceIdEnabled || enableBiometrics))
        setItem('faceIdEnabled', faceIdEnabled || enableBiometrics)
      }
      dispatch(skipBiometrics(false))
      setItem('skipBiometrics', false)
      pinSetHandler(pin1)
      dispatch(setLockPin(pin1))
      dispatch(setLockPinAvailable(true))
      dispatch(setLockingEnabled(true))
      setItem('lockingEnabled', true)
      if (locked) {
        dispatch(appUnlock())
      } else {
        navigation.navigate('Home')
      }
      setErrorMessage(undefined)
    } else {
      setErrorMessage(t('error1'))
    }
  }

  const handleDigitPress = (n: number) => {
    if (pin1.length >= CELL_COUNT) {
      return
    }
    const newPin = pin1 + n
    setPin1(newPin)
  }

  const onBackspacePress = () => {
    const delPin = pin1.substring(0, pin1.length - 1)
    setPin1(delPin)
  }

  const onBackspacePress2 = () => {
    const delPin = pin2.substring(0, pin2.length - 1)
    setPin2(delPin)
  }

  const handleDigitPress2 = (n: number) => {
    if (pin2.length >= CELL_COUNT) {
      return
    }
    const newPin = pin2 + n
    setPin2(newPin)
  }

  useStatusBarBackgroundColor('white')

  return (
    <ScrollView px="16px" pt={'20px'} background={'white'}>
      <Heading mt="30px">
        {step1 ? t('createPinTitle') : t('confirmPinTitle')}
      </Heading>
      <Text>{step1 ? t('createPinSubTitle') : t('confirmPinSubtitle')}</Text>

      {step1 ? (
        <>
          <Box
            marginTop="20px"
            marginBottom="20px"
            mx="16px"
            pointerEvents="none">
            <PinTextInput
              cellCount={CELL_COUNT}
              value={pin1}
              onChange={setPin1}
            />
          </Box>
          {errorMessage && (
            <Text color="red.50" textAlign="center">
              {errorMessage}
            </Text>
          )}
          <Box alignSelf="center" my="20px">
            <NumberKeypad
              handleDigitPress={handleDigitPress}
              onBackspacePress={onBackspacePress}
            />
          </Box>
        </>
      ) : (
        <>
          <Box
            marginTop="20px"
            marginBottom="40px"
            mx="16px"
            pointerEvents="none">
            <PinTextInput
              cellCount={CELL_COUNT}
              value={pin2}
              onChange={setPin2}
            />
            {errorMessage && (
              <Text color="red.50" textAlign="center">
                {errorMessage}
              </Text>
            )}
          </Box>
          <Box alignSelf="center">
            <NumberKeypad
              handleDigitPress={handleDigitPress2}
              onBackspacePress={onBackspacePress2}
            />
          </Box>
        </>
      )}
    </ScrollView>
  )
}

export default PinCodeRegistration
