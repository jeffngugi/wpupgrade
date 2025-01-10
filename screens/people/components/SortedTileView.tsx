import React from 'react'
import { TColleague } from '../types'
import PersonTileCard from './PersonTileCard'
import { Box, FlatList } from 'native-base'

type Props = {
  data: TColleague[]
  refetch: () => void
  isRefetching: boolean
}

const SortedListView = ({ data, refetch, isRefetching }: Props) => {
  const renderItem = ({ item, index }: { item: TColleague; index: number }) => {
    return <PersonTileCard item={item} index={index} />
  }
  return (
    <Box flex={1}>
      <FlatList
        showsVerticalScrollIndicator={false}
        flex={1}
        data={data}
        numColumns={2}
        renderItem={renderItem}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </Box>
  )
}

export default SortedListView
