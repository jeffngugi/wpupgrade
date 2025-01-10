import React, { useState } from 'react'
import { Box, Button, Text } from 'native-base'
import DeleteModal from '~components/modals/DeleteModal'
import { useLogoutAndClearData } from '~hooks/useLogout'
import SubmitButton from '~components/buttons/SubmitButton'
type Props = {
  setForgotPin: (value: boolean) => void
}
const ForgotPinView = ({ setForgotPin }: Props) => {
  const [logout, setLogout] = useState(false)
  // const { logoutAndClearData } = useLogout()
  const { logoutAndClearPinData } = useLogoutAndClearData()

  //TO DO: Rewrite the UI once the designs are provided
  return (
    <Box flex={1} backgroundColor="white" px="16px">
      <Box flex={1} justifyContent="center">
        <Text textAlign="center">
          For you to reset your pin, please logout and create a new PIN.
        </Text>
        <Button onPress={() => setLogout(true)}>Logout and reset</Button>
      </Box>
      <Text textAlign="center">Already have a pin?</Text>

      <SubmitButton title="Cancel" onPress={() => setForgotPin(false)} />
      {logout && (
        <DeleteModal
          btbLabel="Log out"
          title="Log out"
          description="Please note that this will clear your pin and log you out"
          onDelete={logoutAndClearPinData}
          isVisible={logout}
          hideModal={() => setLogout(false)}
          closeIcon
        />
      )}
    </Box>
  )
}

export default ForgotPinView
