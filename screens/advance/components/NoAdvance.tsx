import React from 'react'
import { Box, Text, Button } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { AppModules } from '~types'
import EmptyState from '~components/empty-state/EmptyState'
import { AdvanceRoutes } from '~types'
import SubmitButton from '~components/buttons/SubmitButton'

const NoAdvance = () => {
  const navigation = useNavigation()
  return (
    <Box flex={1} backgroundColor="white">
      <EmptyState moduleName={AppModules.advances} />

      <SubmitButton
        onPress={() => navigation.navigate(AdvanceRoutes.Apply)}
        title="Apply for salary advance"
      />
    </Box>
  )
}

export default NoAdvance
