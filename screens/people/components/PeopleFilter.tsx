import React from 'react'
import { Box, FlatList, Heading, Text, Pressable } from 'native-base'
import Check from '~assets/svg/check.svg'
import { TPeopleSort } from '../Peoples'

type Props = {
  peoples: TPeopleSort[]
  onPress: (item: TPeopleSort, index: number) => void
  selectedIndex: number | null
}

const PeopleFilter = ({ peoples, onPress, selectedIndex }: Props) => {
  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        alignItems="center"
        justifyContent="space-between"
        my="12px"
        flexDirection="row"
        onPress={() => onPress(item, index)}>
        <Text
          fontSize="18px"
          color={selectedIndex === index ? 'green.50' : 'charcoal'}>
          {item.label}
        </Text>
        {selectedIndex === index ? <Check /> : <Box />}
      </Pressable>
    )
  }
  return (
    <Box px="16px">
      <Heading fontSize="20px" my={'20px'}>
        Sort By
      </Heading>
      <FlatList data={peoples} renderItem={renderItem} />
    </Box>
  )
}
export default PeopleFilter
