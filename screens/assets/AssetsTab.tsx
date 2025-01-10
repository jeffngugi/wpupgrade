import React from 'react'
import { Box } from 'native-base'
import LoaderScreen from '~components/LoaderScreen'
import { useGetAssets } from '~api/assets'
import AssetListing from './containsers/AssetListing'
import NoAsset from './components/NoAsset'
import { TAsset } from '~api/assets/types'

const AssetsTab = () => {
  const { data, isLoading } = useGetAssets()
  let assets: TAsset[] = []

  if (isLoading) {
    return <LoaderScreen />
  }

  if (data?.data?.data[0]) {
    assets = data?.data?.data[0].assets ?? []
  }

  return (
    <Box flex={1}>
      {assets.length > 0 ? <AssetListing assets={assets} /> : <NoAsset />}
    </Box>
  )
}

export default AssetsTab
