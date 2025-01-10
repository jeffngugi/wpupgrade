import React, { useEffect } from 'react'
import { Box, HStack, Pressable, Text, Divider } from 'native-base'
import PinIcon from '~assets/svg/pin.svg'
import { useNavigation } from '@react-navigation/native'
import { ExpenseRoutes, MainStackUseNavigationProp } from '~types'
import { dateFormatter } from '~utils/date'
import ExpenseStatusFormatter from './statusFormatter'
import BigDot from '~components/BigDot'
import { TExpenseItem } from '../types'
import { useDispatch } from 'react-redux'
import { setExpenseItem } from '~store/actions/expenses'

const ExpenseItem = ({ item }: { item: TExpenseItem }) => {
  const navigation = useNavigation<MainStackUseNavigationProp>()
  const dispatch = useDispatch()
  const receiptsNumber = item?.has_receipts
    ? item.receipts?.length ?? item.with_valid_receipts?.length ?? 0
    : 0;

  useEffect(() => {
    dispatch(setExpenseItem(item))
  }, [item])

  return (
    <Pressable
      onPress={() => {
        dispatch(setExpenseItem(item))
        navigation.navigate(ExpenseRoutes.Details, { item })
      }
      }>
      <HStack justifyContent="space-between" mt="16px" mb="20px" pr={'8px'}>
        <Box width={'80%'}>
          <Text
            fontSize="20px"
            color="charcoal"
            fontFamily="body"
            lineHeight={'24px'}>
            {item?.title}
          </Text>
          <Text
            color="charcoal"
            fontSize="18px"
            mt="4px"
            fontFamily="heading"
            lineHeight={'21px'}>
            {item?.currency_code} {item?.amount}
          </Text>
          <HStack alignItems={'center'} mt={'8px'}>
            <Text fontSize={'14px'} lineHeight={'16px'}>
              {item?.is_imprest ? 'Imprest' : 'Employee'} {` expense`}
            </Text>
          </HStack>
          <HStack alignItems={'center'} mt={'8px'}>
            <Text color="grey" fontSize={'14px'} lineHeight={'16px'} mr={'2px'}>
              {item?.sub_category ?? '-'}
            </Text>
            <BigDot bgColor="grey" />
            <Text fontSize={'14px'} lineHeight={'16px'}>
              {dateFormatter(item?.expense_date, 'MMM do, yyyy') ?? '-'}
            </Text>
          </HStack>

        </Box>
        <Box
          alignItems="flex-end"
          justifyContent="space-between"
          mt={'4px'}
          pr={'4px'}>
          <ExpenseStatusFormatter status={item?.status} center={false} />
          {receiptsNumber > 0 && (
            <HStack alignItems="center">
              <PinIcon color="green" />
              <Text ml="5px">{receiptsNumber}</Text>
            </HStack>
          )}
        </Box>
      </HStack>
      <Divider />
    </Pressable>
  )
}

export default ExpenseItem
