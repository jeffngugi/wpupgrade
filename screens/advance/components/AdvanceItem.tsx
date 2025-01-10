import React from 'react'
import { Pressable, HStack, Text, Divider, Box } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { AdvanceRoutes, TAdvance } from '~types'
import { Badge } from 'native-base'
import { currencyWithCode } from '~utils/appUtils'
import { useAdvanceStatus } from '~hooks/useAdvanceStatus'
import { dateToString } from '~utils/date'
import { trim } from 'lodash'

const AdvanceItem = ({ item }: { item: TAdvance }) => {
  const navigation = useNavigation()
  const amount = item?.amount ?? '-'
  const currencyAmount = trim(currencyWithCode(item.currency_code, amount))

  const { status, variant } = useAdvanceStatus(item.approval_status, item.paid)
  const date = dateToString(item?.start_date, 'MMMM do') ?? '-'
  return (
    <Pressable
      onPress={() => navigation.navigate(AdvanceRoutes.Detail, { item })}>
      <Box flexDirection="row" justifyContent="space-between" my={'16px'}>
        <Box>
          <Text color="charcoal" fontSize="20px" fontFamily={'heading'}>
            {currencyAmount}
          </Text>
          <Text fontSize={'16px'}>{date}</Text>
        </Box>
        <Badge variant={variant}>
          <Text fontSize={'12px'} color={'white'}>
            {status}
          </Text>
        </Badge>
      </Box>
      <Divider />
    </Pressable>
  )
}

export default AdvanceItem
