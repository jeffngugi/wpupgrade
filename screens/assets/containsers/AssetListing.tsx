import { Box } from 'native-base'
import React from 'react'

import { FlatList, ListRenderItemInfo } from 'react-native'
import AssetItem from '../components/AssetItem'
import { TAsset } from '~api/assets/types'

const AssetListing = ({ assets }: { assets: TAsset[] }) => {
  return (
    <Box flex={1} backgroundColor="white">
      <FlatList
        data={assets}
        renderItem={({ item }: ListRenderItemInfo<TAsset>) => (
          <AssetItem item={item} />
        )}
      />
    </Box>
  )
}

export default AssetListing
