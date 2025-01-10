import { Box } from 'native-base'
import React from 'react'
import EmptyState from '~components/empty-state/EmptyState'
import { AppModules } from '~types'

const NoTA = () => {
  return (
    <Box flex={1}>
      <EmptyState moduleName={AppModules.ta} />
    </Box>
  )
}

export default NoTA
