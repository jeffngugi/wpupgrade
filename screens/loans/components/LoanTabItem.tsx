import { useNavigation } from '@react-navigation/native'
import { Box, Divider, HStack, Pressable, Text } from 'native-base'
import React from 'react'
import { LoanRoutes } from '~types'
import LoanStatusFormatter from './LoanStatusFormatter'
import { formatDate } from '~utils/date'
import { currencyFormatter } from '~utils/app-utils'
import Tag from './Tag'

const LoanTabItem = ({ item }: object) => {
  const navigation = useNavigation()
  const principal = currencyFormatter(item?.principal, item?.currency_code)
  const tagName = item?.funding_type === 'CLIENT' ? 'Company' : 'Workpay'

  return (
    <Pressable
      onPress={() =>
        navigation.navigate(LoanRoutes.Detail, { loanDetail: item })
      }>
      <HStack justifyContent="space-between" my="20px">
        <Box>
          <HStack alignItems="center">
            <Text fontSize="20px" color="charcoal" fontFamily={'heading'}>
              {principal}
            </Text>
            <Tag tagName={tagName} />
          </HStack>
          <HStack my="4px" alignItems="center">
            <Text color="charcoal" fontSize="16px">
              {item?.loan_type_name}
            </Text>
            <Box
              width="4px"
              height="4px"
              borderRadius="2px"
              bgColor="charcoal"
              mx="5px"
            />
            <Text fontSize="16px">{item?.duration} Months</Text>
          </HStack>
          <Text fontSize="14px">
            {formatDate(item?.start_date, 'monthday')}
          </Text>
        </Box>
        <LoanStatusFormatter status={item?.status}></LoanStatusFormatter>
      </HStack>
      <Divider />
    </Pressable>
  )
}

export default LoanTabItem
