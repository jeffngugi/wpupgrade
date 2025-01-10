import React from 'react'
import { Box, Text, Button } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { AppModules, LeaveRoutes } from '~types'
import EmptyState from '~components/empty-state/EmptyState'
import SubmitButton from '~components/buttons/SubmitButton'

const NoLeave = () => {
  const navigation = useNavigation()
  return (
    <Box flex={1} backgroundColor="white">
      <Box flex={1} alignItems="center" justifyContent="center">
        <EmptyState moduleName={AppModules.leaves} />
      </Box>

      <SubmitButton
        onPress={() => navigation.navigate(LeaveRoutes.Request)}
        title="Apply for leave"
      />
    </Box>
  )
}

export default NoLeave
