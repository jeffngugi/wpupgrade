import React from 'react'
import { Box, FlatList, Heading, Text, Pressable } from 'native-base'

import Check from '~assets/svg/check.svg'

type Props = {
  options: { label: string; value: string }[]
  onPress: (item: string, index: number) => void
  selectedIndex?: number | null
}

const ActionSheetMenu = ({ options, onPress, selectedIndex }: Props) => {
  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        alignItems="center"
        justifyContent="space-between"
        my="12px"
        flexDirection="row"
        onPress={() => onPress(item.value, index)}>
        <Text fontSize="18px">{item.label}</Text>
        {selectedIndex === index ? <Check /> : <Box />}
      </Pressable>
    )
  }
  return (
    <Box px="16px">
      <Heading fontSize="20px" my={'20px'}>
        Sort By
      </Heading>
      <FlatList data={options} renderItem={renderItem} />
    </Box>
  )
}
export default ActionSheetMenu
