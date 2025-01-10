import React from 'react'
import { Box, FlatList, Heading, Text, Pressable } from 'native-base'
import { TBatch } from '../types'
import Check from '~assets/svg/check.svg'

type Props = {
  years: TBatch[]
  onPress: (item: string, index: number) => void
  selectedIndex: number | null
}

const PayslipFilter = ({ years, onPress, selectedIndex }: Props) => {
  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        alignItems="center"
        justifyContent="space-between"
        my="12px"
        flexDirection="row"
        onPress={() => onPress(item.year, index)}>
        <Text fontSize="18px">{item.year}</Text>
        {selectedIndex === index ? <Check /> : <Box />}
      </Pressable>
    )
  }
  return (
    <Box px="16px">
      <Heading fontSize="20px" my={'20px'}>
        Sort By
      </Heading>
      <FlatList data={years} renderItem={renderItem} />
    </Box>
  )
}
export default PayslipFilter
