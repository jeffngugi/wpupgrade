import { Box, Text } from 'native-base'
import { Dispatch } from 'redux'
import React, { useState } from 'react'
import ScreenHeader from '~components/ScreenHeader'
import NumberKeypad from '~components/NumberKeypad'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import SubmitButton from '~components/buttons/SubmitButton'
import PinTextInput from '~screens/authentication/pincode/PinTextInput'
import {
  AccountsRoutes,
  MainNavigationProp,
  MainNavigationRouteProp,
} from '~types'
import { ApplicationAction, State } from '~declarations'
import { useDispatch, useSelector } from 'react-redux'
import { storeSecureItem } from '~storage/secureStore'
import { setLockPin } from '~store/actions/Application'
import PinResetSuccess from './components/PinResetSuccess'
import { useTranslation } from 'react-i18next'

type PinHeadings = {
  title: string
  description: string
}

interface Props {
  navigation: MainNavigationProp<AccountsRoutes.SetPin>
  route: MainNavigationRouteProp<AccountsRoutes.SetPin>
}

const SetPinScreen = ({ navigation }: Props) => {
  useStatusBarBackgroundColor('white')
  const { lockPin } = useSelector((state: State) => state.application)
  const dispatch: Dispatch<ApplicationAction> = useDispatch()
  const { t } = useTranslation('lockscreen')
  const CELL_COUNT = 4
  const [isSuccess, setIsSuccess] = useState(false)
  const [oldPin, setOldPin] = useState('')
  const [pin1, setPin1] = useState('')
  const [pin2, setPin2] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const headings: PinHeadings[] = [
    { title: t('setPinTitle1'), description: t('setPinSubTitle1') },
    { title: t('setPinTitle2'), description: t('setPinSubTitle2') },
    {
      title: t('setPinTitle3'),
      description: t('setPinSubTitle3'),
    },
  ]

  const handleCheckOldPinMatches = () => {
    if (oldPin.length >= 4 && oldPin === lockPin) {
      setStep(2)
      setError(undefined)
    } else {
      setError(t('error2'))
    }
  }

  const handleSetNewPin = () => {
    if (pin1.length >= 4) {
      setStep(3)
      setError(undefined)
    } else {
      setError(t('error3'))
    }
  }

  const handleConfirmNewPinsMatches = () => {
    if (pin2.length >= 4 && pin1 === pin2) {
      setError(undefined)
      storeSecureItem('pin', pin1)
      dispatch(setLockPin(pin1))
      requestAnimationFrame(() => setIsSuccess(true))
    } else {
      setError(t('error4'))
    }
  }
  const handleNext = () => {
    switch (step) {
      case 1:
        handleCheckOldPinMatches()
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

  const handleOldDigitPress = (n: number) => {
    if (oldPin.length >= CELL_COUNT) {
      return
    }
    const newPin = oldPin + n
    setOldPin(newPin)
  }

  const handlePin1DigitPress = (n: number) => {
    if (pin1.length >= CELL_COUNT) {
      return
    }
    const newPin = pin1 + n
    setPin1(newPin)
  }

  const handlePin2DigitPress = (n: number) => {
    if (pin2.length >= CELL_COUNT) {
      return
    }
    const newPin = pin2 + n
    setPin2(newPin)
  }

  const onOldBackspacePress = () => {
    const delPin = oldPin.substring(0, oldPin.length - 1)
    setOldPin(delPin)
  }

  const onPin1BackspacePress = () => {
    const delPin = pin1.substring(0, pin1.length - 1)
    setPin1(delPin)
  }

  const onPin2BackspacePress = () => {
    const delPin = pin2.substring(0, pin2.length - 1)
    setPin2(delPin)
  }

  const OldPin = () => (
    <Box>
      <PinTextInput
        cellCount={CELL_COUNT}
        value={oldPin}
        onChange={setOldPin}
      />
      {error && (
        <Text color="red.50" textAlign="center">
          {error}
        </Text>
      )}
      <Box marginY="20px" />
      <NumberKeypad
        handleDigitPress={handleOldDigitPress}
        onBackspacePress={onOldBackspacePress}
        showBiometric={false}
      />
    </Box>
  )

  const Pin1 = () => (
    <Box>
      <PinTextInput cellCount={CELL_COUNT} value={pin1} onChange={setPin1} />
      {error && (
        <Text color="red.50" textAlign="center">
          {error}
        </Text>
      )}
      <Box marginY="20px" />
      <NumberKeypad
        handleDigitPress={handlePin1DigitPress}
        onBackspacePress={onPin1BackspacePress}
        showBiometric={false}
      />
    </Box>
  )

  const Pin2 = () => (
    <Box>
      <PinTextInput cellCount={CELL_COUNT} value={pin2} onChange={setPin2} />
      {error && (
        <Text color="red.50" textAlign="center">
          {error}
        </Text>
      )}
      <Box marginY="20px" />
      <NumberKeypad
        handleDigitPress={handlePin2DigitPress}
        onBackspacePress={onPin2BackspacePress}
        showBiometric={false}
      />
    </Box>
  )

  const renderPinSetUps = () => {
    switch (step) {
      case 1:
        return <OldPin />
      case 2:
        return <Pin1 />
      case 3:
        return <Pin2 />
      default:
        return <Box />
    }
  }

  return (
    <Box safeArea flex={1} background={'white'}>
      {isSuccess ? (
        <PinResetSuccess />
      ) : (
        <>
          <Box flex={1}>
            <Box px="16px">
              <ScreenHeader
                title={headings[step - 1].title}
                close
                onPress={() => navigation.goBack()}
              />
            </Box>
            <Text alignSelf="center" fontSize="16px" marginTop={'12px'}>
              {headings[step - 1].description}
            </Text>
            <Box marginTop={'64px'}>{renderPinSetUps()}</Box>
          </Box>
          <Box mx={'16px'}>
            <SubmitButton
              title={step < 3 ? t('next') : t('setPin')}
              onPress={handleNext}
            />
          </Box>
        </>
      )}
    </Box>
  )
}

export default SetPinScreen
