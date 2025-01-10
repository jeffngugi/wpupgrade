import React, { useEffect, useState } from 'react'
import PinCodeLock from './PinCodeLock'
import PinCodeRegistration from './PinCodeRegistration'
import { useDispatch, useSelector } from 'react-redux'
import { State } from '~declarations'
import FingerPrintScreen from './FingerPrintScreen'
import {
  setBiometricEnabled,
  setFaceIdEnabled,
} from '~store/actions/Application'
import { setItem } from '~storage/device-storage'
import PinLandingScreen from './PinLandingScreen'

const PinCodeScreen = ({ route }: { route: any }) => {
  const {
    lockPinAvailable,
    fingerprintEnabled,
    biometricEnabled,
    skipBioMetrics,
    faceIdEnabled,
  } = useSelector((state: State) => state.application)
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  )
  const [pinSetStep, setPinSetStep] = useState<number>(1)

  const fromAccountScreen =
    route?.params?.from === 'AccountScreen' ? true : false

  const enableBiometrics = route?.params?.enableBiometrics ?? false
  const enableFaceId = route?.params?.enableFaceId ?? false

  useEffect(() => {
    if (route?.params?.from === 'AccountScreen') {
      setPinSetStep(2)
    }
  }, [route?.params?.from])

  useEffect(() => {
    if (!lockPinAvailable && !fingerprintEnabled && !fromAccountScreen) {
      // console.log('setting biometric enabled to false no lock pin')
      if (biometricEnabled) {
        dispatch(setBiometricEnabled(false))
        setItem('biometricEnabled', false)
      }
      if (faceIdEnabled) {
        dispatch(setFaceIdEnabled(false))
        setItem('faceIdEnabled', false)
      }
    }
  }, [lockPinAvailable, fingerprintEnabled, biometricEnabled, faceIdEnabled])

  return (
    <>
      {!fromAccountScreen &&
      !biometricEnabled &&
      !fingerprintEnabled &&
      !skipBioMetrics &&
      !faceIdEnabled ? (
        <FingerPrintScreen />
      ) : lockPinAvailable ? (
        <PinCodeLock
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      ) : pinSetStep === 2 ? (
        <PinCodeRegistration
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          enableBiometrics={enableBiometrics}
          enableFaceId={enableFaceId}
        />
      ) : (
        <PinLandingScreen
          setPinSetStep={setPinSetStep}
          pinSetStep={pinSetStep}
        />
      )}
    </>
  )
}

export default PinCodeScreen
