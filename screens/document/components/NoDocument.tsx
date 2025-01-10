import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Box, Button, Text } from 'native-base'
import { AppModules, DocumentRoutes } from '~types'
import EmptyState from '~components/empty-state/EmptyState'
import SubmitButton from '~components/buttons/SubmitButton'
import EmptyStateDynamic from '~components/empty-state/EmptyStateDynamic'

const NoDocument = () => {
  const navigation = useNavigation()

  return (
    <Box flex={1}>
      <Box flex={1} alignItems="center" justifyContent="center">
        <EmptyState moduleName={AppModules.documents} />
      </Box>
      <SubmitButton
        onPress={() => navigation.navigate(DocumentRoutes.AddDocument)}
        title="Add Document"
        mb="32px"
      />
    </Box>
  )
}

export default NoDocument
