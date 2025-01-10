import React from 'react'
import { Box } from 'native-base'
import { AppModules } from '~types'
import EmptyState from '~components/empty-state/EmptyState'

const NoAsset = () => {
  return (
    <Box flex={1} backgroundColor="white">
      <Box flex={1} alignItems="center" justifyContent="center">
        <EmptyState moduleName={AppModules.assets} />
      </Box>
    </Box>
  )
}

export default NoAsset
