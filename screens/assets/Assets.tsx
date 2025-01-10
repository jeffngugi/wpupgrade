import React from 'react'
import { Box } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import AssetsTab from './AssetsTab'
import { AssetRoutes, MainNavigationProp } from '~types'

interface Props {
  navigation: MainNavigationProp<AssetRoutes.Asset>
}

const Assets = ({ navigation }: Props) => {
  return (
    <Box safeArea flex={1} backgroundColor="white" paddingX="16px">
      <ScreenHeader onPress={() => navigation.goBack()} title="Assets" />
      <Box height={'24px'} />
      <AssetsTab />
    </Box>
  )
}

export default Assets
