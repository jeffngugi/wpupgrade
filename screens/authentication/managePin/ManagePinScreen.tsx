import React, { useEffect } from 'react'
import {
  Box,
  Divider,
  HStack,
  Pressable,
  Switch,
  Text,
  Toast,
} from 'native-base'

import RightChev from '~assets/svg/chev-right.svg'
import { AccountsRoutes } from '~types'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import ScreenHeader from '~components/ScreenHeader'
import { useDispatch, useSelector } from 'react-redux'
import {
  setBiometricEnabled,
  setFaceIdEnabled,
  setLockPinAvailable,
  setLockingEnabled,
} from '~store/actions/Application'
import { State } from '~declarations'
import { setItem } from '~storage/device-storage'

const ManagePinScreen = ({ navigation }) => {
  useStatusBarBackgroundColor('white')
  const { lockingEnabled, biometricEnabled, faceIdEnabled, lockPinAvailable } =
    useSelector((state: State) => state.application)

  const dispatch = useDispatch()

  const handleEnablePin = () => {
    if (lockingEnabled) {
      if (biometricEnabled) {
        dispatch(setBiometricEnabled(false))
        setItem('biometricEnabled', false)
        Toast.show({
          title: 'Biometrics disabled',
          duration: 3000,
        })
      }
      if (faceIdEnabled) {
        dispatch(setFaceIdEnabled(false))
        setItem('faceIdEnabled', false)
        Toast.show({
          title: 'FaceId disabled',
          duration: 3000,
        })
      }
      Toast.show({
        title: 'Locking disabled',
        duration: 3000,
      })
      dispatch(setLockingEnabled(false))
      setItem('lockingEnabled', false)
    } else {
      if (!lockPinAvailable) {
        navigation.navigate(AccountsRoutes.PinCodeScreen)
      } else {
        dispatch(setLockingEnabled(true))
        setItem('lockingEnabled', true)
      }
    }
  }
  return (
    <Box flex={1} safeArea background="white" paddingX="16px">
      <ScreenHeader onPress={() => navigation.goBack()} title="Manage Pin" />
      <Divider mt={'40px'} />
      <HStack justifyContent="space-between" marginY="21px">
        <Text fontSize="16px">Enable Pin</Text>
        <Switch isChecked={lockingEnabled} onToggle={handleEnablePin} />
      </HStack>
      <Divider />
      {lockingEnabled ? (
        <>
          <Pressable
            justifyContent="space-between"
            flexDirection="row"
            marginY="20px"
            alignItems="center"
            onPress={() => navigation.navigate(AccountsRoutes.SetPin)}>
            <Text fontSize="16px">Change Pin</Text>
            <RightChev color="#62A446" />
          </Pressable>
          <Divider marginBottom="21px" />
          <Pressable
            justifyContent="space-between"
            flexDirection="row"
            alignItems="center"
            onPress={() => navigation.navigate(AccountsRoutes.ForgotPin)}>
            <Text fontSize="16px">Forgot Pin</Text>
            <RightChev color="#62A446" />
          </Pressable>
        </>
      ) : null}
    </Box>
  )
}

export default ManagePinScreen
