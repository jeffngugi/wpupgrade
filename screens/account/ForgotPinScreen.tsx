import { Box, Button, Text } from 'native-base'
import React, { useState } from 'react'
import { useLogout, useLogoutAndClearData } from '~hooks/useLogout'
import SubmitButton from '~components/buttons/SubmitButton'
import DeleteModal from '~components/modals/DeleteModal'
import { useDispatch } from 'react-redux'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import { useMyProfile } from '~api/account'
import { InteractionManager } from 'react-native'

type ForgotPinScreenProps = {
  navigation: any
  setForgotPin?: (value: boolean) => void
}

const ForgotPinScreen = ({
  navigation,
  setForgotPin,
}: ForgotPinScreenProps) => {
  const [logout, setLogout] = useState(false)
  const { logoutAndClearPinData } = useLogoutAndClearData()
  const dispatch = useDispatch()
  const { logoutAndClearData } = useLogout()

  const { isLoading: profileLoading, data } = useMyProfile()
  const email = data?.data?.address?.email ?? '-'

  const handleCancel = () => {
    if (setForgotPin) {
      setForgotPin(false)
      return
    }
    navigation.goBack()
  }

  const hide = () => setLogout(false)

  const handleLogout = () => {
    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => logoutAndClearData())
    })

    hide()
    analyticsTrackEvent(AnalyticsEvents.Auth.log_out, {
      email,
    })
  }
  //TO DO: Rewrite the UI once the designs are provided
  return (
    <Box flex={1} backgroundColor="white" px="16px">
      <Box flex={1} justifyContent="center">
        <Text
          textAlign="center"
          fontSize={'16px'}
          color={'gray.500'}
          mb={'10px'}>
          For you to reset your pin, please logout and create a new PIN.
        </Text>
        <Box mt={'20px'} flexDirection={'row'} justifyContent={'space-between'}>
          <Button onPress={handleCancel} bg={'amber.400'} width={'48%'}>
            Cancel
          </Button>
          <Button onPress={() => setLogout(true)} width={'48%'}>
            Logout and reset
          </Button>
        </Box>
      </Box>
      <DeleteModal
        btbLabel="Log out"
        title="Log out"
        description="Please note that this will clear your pin and log you out"
        onDelete={handleLogout}
        isVisible={logout}
        hideModal={() => setLogout(false)}
        closeIcon
      />
    </Box>
  )
}

export default ForgotPinScreen
