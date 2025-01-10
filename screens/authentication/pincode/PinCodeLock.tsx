import React, { useState, useEffect } from 'react'
import { Box, Heading, Pressable, ScrollView, Text } from 'native-base'
import { AppStateStatus, Keyboard } from 'react-native'
import NumberKeypad from '../../../components/NumberKeypad'
import { useTranslation } from 'react-i18next'
import { ApplicationAction, State } from '~declarations'
import { useDispatch, useSelector } from 'react-redux'
import { appUnlock } from '~store/actions/Application'
import PinTextInput from './PinTextInput'
import ForgotPinView from './ForgotPinView'
import * as LocalAuthentication from 'expo-local-authentication'
import { useNavigation } from '@react-navigation/native'
// import { useAppInactivity } from '~utils/hooks/useAppInactivity'
import ForgotPinScreen from '~screens/account/ForgotPinScreen'
import LoaderScreen from '~components/LoaderScreen'
import LoadingModal from '~components/modals/LoadingModal'

type Props = {
  errorMessage: string | undefined
  setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>
}
const PinCodeLock = ({ errorMessage, setErrorMessage }: Props) => {
  const { t } = useTranslation('lockscreen')
  const [value, setValue] = useState('')
  const [unlocking, setUnlocking] = useState(false)
  // const { checkInactive } = useAppInactivity()
  const navigation = useNavigation()

  const [forgotPin, setForgotPin] = useState(false)
  const { lockPin, locked, biometricEnabled, faceIdEnabled } = useSelector(
    (state: State) => state.application,
  )

  const [biometricError, setBiometricError] = useState<string | undefined>(
    undefined,
  )

  const dispatch: React.Dispatch<ApplicationAction> = useDispatch()

  const CELL_COUNT = 4

  const handleComparePin = (pin: string) => {
    if (pin === lockPin) {
      setErrorMessage(undefined)
      dispatch(appUnlock())
      // checkInactive()
    } else {
      setErrorMessage('Oops, incorrect PIN. Please try again')
    }
  }

  useEffect(() => {
    Keyboard.dismiss()
    setForgotPin(false)
  }, [locked])

  useEffect(() => {
    if (value.length === CELL_COUNT) {
      handleComparePin(value)
    }
  }, [value])

  const handleDigitPress = (n: number) => {
    if (value.length >= CELL_COUNT) {
      return
    }
    const newPin = value + n
    setValue(newPin)
  }

  const onBackspacePress = () => {
    const delPin = value.substring(0, value.length - 1)
    setValue(delPin)
  }

  //clear pin and logout user
  const handleForgotPin = () => {
    setErrorMessage(undefined)
    setValue('')
    requestAnimationFrame(() => setForgotPin(true))
  }

  const handleBiometricPress = (n: number) => {
    //n is needed for function compatibility, similar implementation to handleDigitPress
    const enabled = biometricEnabled || faceIdEnabled

    if (!enabled) return
    LocalAuthentication.authenticateAsync({
      promptMessage: 'Log in with Touch ID',
      disableDeviceFallback: true,
      cancelLabel: 'Cancel',
    })
      .then(result => {
        console.log(result)
        if (result.success) {
          // console.log('Authenticated!')
          setErrorMessage(undefined)
          setBiometricError('')

          if (faceIdEnabled) {
            setUnlocking(true)
            setTimeout(() => {
              dispatch(appUnlock())
              setUnlocking(false)
            }, 2500)
            return
          }

          dispatch(appUnlock())
          // checkInactive()
        } else {
          setBiometricError('Biometric authentication failed. Try Again')
        }
      })
      .catch(error => {
        console.log(error)
        setBiometricError('Biometric authentication failed. Try Again')
      })
  }

  const handleAppLock = async (appstate: AppStateStatus) => {
    console.log('app state from nav', appstate)

    if (appstate === 'inactive' || appstate === 'background') {
      console.log('app state from bac')

      return
    }
    // setTimeout(() => {
    //   if (!biometricEnabled || !locked) return
    //   handleBiometricPress(0)
    // }, 2000)
  }

  const isFocused = navigation.isFocused()

  // console.log('isFocused', isFocused)

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!biometricEnabled || !locked || !isFocused) return
  //     console.log('isFocused', isFocused, locked, biometricEnabled)
  //     handleBiometricPress(0)
  //   }, 5000)
  // }, [locked, biometricEnabled, isFocused])

  return (
    <ScrollView
      px="16px"
      contentContainerStyle={{ flexGrow: 1 }}
      pt={'20px'}
      background={'white'}>
      {forgotPin && <ForgotPinScreen setForgotPin={setForgotPin} />}
      {!forgotPin && (
        <>
          <Heading mb="10px">{t('title')}</Heading>
          <Text>{t('subtitle')}</Text>
          <Box flex={1}>
            <Box marginTop="20px" mx="16px" pointerEvents="auto">
              <PinTextInput
                cellCount={CELL_COUNT}
                value={value}
                onChange={setValue}
              />
            </Box>
            {errorMessage && (
              <Text color="red.50" alignSelf="center" mt="5px" fontSize="10px">
                {errorMessage}
              </Text>
            )}
            <Pressable my="15px" alignItems="center" onPress={handleForgotPin}>
              <Text fontSize="16px" color="green.50">
                {t('forgotPin')}
              </Text>
            </Pressable>
            <Box alignSelf="center">
              <NumberKeypad
                handleDigitPress={handleDigitPress}
                onBackspacePress={onBackspacePress}
                onBiometricPress={handleBiometricPress}
              />
            </Box>
            {biometricError && (
              <Text color="red.50" alignSelf="center" mt="5px" fontSize="10px">
                {biometricError}
              </Text>
            )}
          </Box>
          {unlocking && (
            <LoadingModal isVisible={unlocking} message="Unlocking..." />
          )}
        </>
      )}
    </ScrollView>
  )
}

export default PinCodeLock
