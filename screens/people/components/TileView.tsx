import * as React from 'react'
import { Text, FlatList, SectionList } from 'native-base'
import PersonTileCard from './PersonTileCard'
import { TColleague } from '../types'

type TileViewProps = {
  sections: any[]
  refetch: () => void
  isRefetching: boolean
}

const TileView = ({ sections, refetch, isRefetching }: TileViewProps) => {
  const renderListItem = ({
    item,
    index,
  }: {
    item: TColleague
    index: number
  }) => {
    return <PersonTileCard item={item} index={index} />
  }

  const renderSection = ({ section, index }) => {
    return index === 0 ? (
      <FlatList
        data={section.data}
        numColumns={2}
        renderItem={renderListItem}
        keyExtractor={(_, index) => `key ${index}`}
      />
    ) : null
  }

  const renderSectionHeader = ({ section }) => {
    return <Text>{section.title}</Text>
  }

  return (
    <SectionList
      showsVerticalScrollIndicator={false}
      stickyHeaderHiddenOnScroll={false}
      sections={sections}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderSection}
      keyExtractor={(_, index) => `key ${index}`}
      onRefresh={refetch}
      refreshing={isRefetching}
    />
  )
}

export default TileView
