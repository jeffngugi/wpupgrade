import { SectionListRenderItem } from 'react-native'
import React, { useState, useEffect } from 'react'

import { Box, SectionList } from 'native-base'

import {
  AccountSectionItemType,
  AccountSectionTypes,
  AccountsRoutes,
} from '../../types'
import { useAccountData } from './accountsDatas'
import SectionHeader from './components/SectionHeader'
import ItemDivider from './components/ItemDivider'
import ItemsHead from './components/ItemsHead'
import DeleteModal from '../../components/modals/DeleteModal'
import { useMyProfile } from '~api/account'
import LoaderScreen from '~components/LoaderScreen'
import { CustomStatusBar } from '~components/customStatusBar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import { useLogout } from '~hooks/useLogout'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import AccountListItem from '~screens/account/components/AccountListItem'
import { isFeatureEnabled } from '~utils/hooks/useMenuItems'
import { useEnabledFeatures } from '~api/settings'
import { useWalletStatus } from '~screens/wallet/hooks/useWalletStatus'
import { useDispatch, useSelector } from 'react-redux'
import { State } from '~declarations'
import {
  setBiometricEnabled,
  setFaceIdEnabled,
  skipBiometrics,
} from '~store/actions/Application'
import { setItem } from '~storage/device-storage'
import {
  isEnrolledAsync,
  supportsFaceId,
  supportsFingerPrint,
} from '~utils/biometric.util'
import WarningModal from '~components/modals/WarningModal'

const AccountScreen = ({ navigation }) => {
  const [logout, setLogout] = useState<boolean>(false)
  const { lockPinAvailable, biometricEnabled, faceIdEnabled, lockingEnabled } =
    useSelector((state: State) => state.application)
  const [faceIdSupported, setFaceIdSupported] = useState<boolean>(false)
  const [biometricSupported, setBiometricSupported] = useState<boolean>(false)
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState<boolean>(false)
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>('')
  const { getAccountDatas } = useAccountData()

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

  const dispatch = useDispatch()
  const { isLoading: profileLoading, data } = useMyProfile()
  const email = data?.data?.address?.email ?? '-'

  const { data: featuresData, isLoading: loadingEnabledFeatures } =
    useEnabledFeatures()

  const enabledFeatures = featuresData?.data?.data ?? []
  const walletEnabled = isFeatureEnabled('employee-wallet', enabledFeatures)
  const { isActive } = useWalletStatus()
  const showWalletSettings = walletEnabled && isActive
  const accountsDatas = getAccountDatas(showWalletSettings)

  const { logoutAndClearData } = useLogout()

  const hide = () => setLogout(false)
  useStatusBarBackgroundColor('#F1FDEB')

  const handleLogout = () => {
    // logoutAndClearData()
    requestAnimationFrame(() => logoutAndClearData())
    hide()
    analyticsTrackEvent(AnalyticsEvents.Auth.log_out, {
      email,
    })
  }

  const handleSwitchTouchId = () => {
    if (!biometricEnabled) {
      if (!isBiometricEnrolled) {
        setShowErrorModal(true)
        setErrorMessage(
          'Please set up your biometric authentication in your device settings',
        )
        return
      }
      setShowErrorModal(false)
      setErrorMessage('')
      if (lockPinAvailable) {
        if (lockingEnabled) {
          dispatch(setBiometricEnabled(true))
          setItem('biometricEnabled', true)
          dispatch(setFaceIdEnabled(false))
          setItem('faceIdEnabled', false)
        } else {
          setShowErrorModal(true)
          setErrorMessage('Please enable pin in manage pin section to proceed')
        }
      } else {
        navigation.navigate(AccountsRoutes.PinCodeScreen, {
          from: 'AccountScreen',
          enableBiometrics: true,
        })
      }
    } else {
      dispatch(setBiometricEnabled(false))
      setItem('biometricEnabled', false)
    }
  }

  const handleSwitchFaceId = () => {
    if (!faceIdEnabled) {
      if (!faceIdSupported) {
        setShowErrorModal(true)
        setErrorMessage(
          'Please set up your biometric authentication in your device settings',
        )
        return
      }

      setShowErrorModal(false)
      setErrorMessage('')

      if (lockPinAvailable) {
        if (lockingEnabled) {
          dispatch(setBiometricEnabled(false))
          setItem('biometricEnabled', false)

          dispatch(skipBiometrics(false))
          setItem('skipBiometrics', false)

          dispatch(setFaceIdEnabled(true))
          setItem('faceIdEnabled', true)
        } else {
          setShowErrorModal(true)
          setErrorMessage('Please enable pin in manage pin section to proceed')
        }
      } else {
        navigation.navigate(AccountsRoutes.PinCodeScreen, {
          from: 'AccountScreen',
          enableFaceId: true,
        })
      }
    } else {
      dispatch(setBiometricEnabled(false))
      setItem('biometricEnabled', false)

      dispatch(setFaceIdEnabled(false))
      setItem('faceIdEnabled', false)
    }
  }

  const renderItem: SectionListRenderItem<
    AccountSectionItemType,
    AccountSectionTypes
  > = ({ item }) => {
    const { Icon } = item
    const switchType = item.label === 'Touch ID Login' ? 'TouchID' : 'FaceID'

    if (item.label === 'Touch ID Login' && !biometricSupported) {
      return null
    }

    if (item.label === 'Face ID Login' && !faceIdSupported) {
      return null
    }

    const handlePress = () => {
      if (item.route) {
        // eslint-disable-next-line react/prop-types
        navigation.navigate(item.route)
      }

      if (!item.route && item.label === 'Log Out') {
        setLogout(true)
      }
    }

    const handleSwitch = () => {
      if (switchType === 'TouchID') {
        handleSwitchTouchId()
      } else {
        handleSwitchFaceId()
      }
    }

    return (
      <AccountListItem
        handlePress={handlePress}
        item={item}
        handleSwitch={handleSwitch}
        switchEnabled={
          switchType === 'TouchID' ? biometricEnabled : faceIdEnabled
        }
      />
    )
  }

  if (profileLoading || loadingEnabledFeatures) return <LoaderScreen />

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor="#F1FDEB" />
      <Box backgroundColor="white" flex={1}>
        <SectionHeader />
        <Box mt={'14px'}></Box>
        <SectionList
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          sections={accountsDatas}
          ItemSeparatorComponent={ItemDivider}
          keyExtractor={(index, item) => index.toString() + item}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <ItemsHead title={title} />
          )}
          renderSectionFooter={ItemDivider}
        />
        {logout && (
          <DeleteModal
            btbLabel="Log out"
            title="Log out"
            description="Are you sure you want to log out of your workpay account?"
            onDelete={handleLogout}
            isVisible={logout}
            hideModal={() => setLogout(false)}
            closeIcon
          />
        )}
        {showErrorModal && (
          <WarningModal
            title="Error"
            description={errorMessage || 'An error occurred'}
            isVisible={showErrorModal}
            hideModal={() => setShowErrorModal(false)}
          />
        )}
      </Box>
    </SafeAreaProvider>
  )
}

export default AccountScreen
