import React from 'react'
import { Box, HStack, Text } from 'native-base'
import BigDot from '~components/BigDot'
import { Divider } from 'native-base'
import { TAsset } from '~api/assets/types'
import { dateToString } from '~utils/date'

const AssetItem = ({ item }: { item: TAsset }) => {
  const date = item?.date_of_issue
    ? dateToString(item.date_of_issue, 'MMM do, yyy')
    : '-'
  return (
    <Box>
      <HStack justifyContent="space-between" alignItems="center" mt={'16px'}>
        <Text color="charcoal" fontSize="16px">
          {item.name ?? '-'}
        </Text>
        <Text color={'grey'} fontSize={'14px'}>
          {date ?? '-'}
        </Text>
      </HStack>
      <HStack alignItems="center" mb={'16px'} mt={'8px'}>
        <Text color={'grey'} mr={'3px'} fontSize={'14px'}>
          {item.asset_category_name ?? '-'}
        </Text>
        <BigDot bgColor="grey" />
        <Text color={'grey'} ml={'3px'} fontSize={'14px'}>
          {item?.unique_identifier ?? '-'}
        </Text>
      </HStack>
      <Divider width="80%" alignSelf="flex-end" />
    </Box>
  )
}

export default AssetItem
