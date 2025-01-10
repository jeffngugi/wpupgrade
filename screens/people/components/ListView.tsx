import React from 'react'
import { Box, Text, SectionList } from 'native-base'
import PersonListCard from './PersonListCard'
import { TSortedColleague } from '../types'

const ListView = ({
  data,
  refetch,
  isRefetching,
}: {
  data: TSortedColleague[]
  refetch: () => void
  isRefetching: boolean
}) => {
  return (
    <Box flex={1}>
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={data}
        keyExtractor={(_, index) => `key ${index}`}
        renderItem={({ item, index }) => (
          <PersonListCard item={item} index={index} />
        )}
        renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </Box>
  )
}

export default ListView
