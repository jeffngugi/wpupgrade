import React from 'react'
import { TColleague } from '../types'
import PersonListCard from './PersonListCard'
import { Box, FlatList } from 'native-base'

type Props = {
  data: TColleague[]
  filterText?: string
  refetch: () => void
  isRefetching: boolean
}

const SortedListView = ({ data, filterText, refetch, isRefetching }: Props) => {
  const renderItem = ({ item, index }: { item: TColleague; index: number }) => {
    return <PersonListCard item={item} index={index} filterText={filterText} />
  }
  return (
    <Box flex={1}>
      <FlatList
        showsVerticalScrollIndicator={false}
        flex={1}
        data={data}
        renderItem={renderItem}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </Box>
  )
}

export default SortedListView
