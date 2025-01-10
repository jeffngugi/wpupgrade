import React from 'react'
import { Box, Text, Button } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { AppModules, OvertimeRoutes } from '../../types'
import EmptyState from '~components/empty-state/EmptyState'
import SubmitButton from '~components/buttons/SubmitButton'

const NoOvertime = () => {
  const navigation = useNavigation()
  return (
    <Box flex={1} backgroundColor="white">
      <EmptyState moduleName={AppModules.overtime} />

      <SubmitButton
        onPress={() => navigation.navigate(OvertimeRoutes.RequestForm)}
        title="Request for Overtime"
      />
    </Box>
  )
}

export default NoOvertime
