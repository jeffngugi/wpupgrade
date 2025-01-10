import { useRoute } from '@react-navigation/native'
import { Box, Divider, HStack, Text } from 'native-base'
import React from 'react'
import { currencyFormatter } from '~utils/app-utils'

type ScheduleItemProps = {
  item: any
  currencyCode: string
}

const ScheduleItem = ({ item }: ScheduleItemProps) => {
  const params = useRoute().params
  const currencyCode = params?.currencyCode
  return (
    <Box>
      <Box paddingX="16px" py="24px">
        <Text color={'grey'} fontSize={'16px'}>
          {item?.month} {item?.year}
        </Text>
        <HStack justifyContent="space-between" my={'16px'}>
          <Text color="charcoal" fontSize="18px">
            Balance
          </Text>
          <Text color="green.50" fontSize="18px" fontFamily={'heading'}>
            {currencyFormatter(item?.balance, currencyCode)}
          </Text>
        </HStack>
        <HStack justifyContent="space-between">
          <Text color="charcoal" fontSize="18px">
            Total deduction
          </Text>
          <Text color="green.50" fontSize="18px" fontFamily={'heading'}>
            {currencyFormatter(item?.total_deduction, currencyCode)}
          </Text>
        </HStack>
      </Box>
      <Divider height="5px" backgroundColor="#F3F3F3" />
    </Box>
  )
}

export default ScheduleItem
