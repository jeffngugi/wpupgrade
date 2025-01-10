import { useNavigation } from '@react-navigation/native'
import {
  Box,
  Heading,
  HStack,
  Pressable,
  Text,
  Divider,
  VStack,
} from 'native-base'
import React from 'react'
import { EwaRoutes, MainNavigationProp, TEwaTransaction } from '~types'
import { capitalize } from 'lodash'
import { useEwaStatusColor } from '~utils/hooks/useEwaStatusColor'
import { dateToString, formatFromWPDate } from '~utils/date'
import EwaArrow from '~assets/svg/ewa-arrow.svg'
import { currencyWithCode } from '~utils/appUtils'

const EwaTransactionCard = ({ item }: { item: TEwaTransaction }) => {
  const { created_at, status, amount, currency } = item
  const navigation = useNavigation<MainNavigationProp<EwaRoutes.Ewa>>()
  const statusColor = useEwaStatusColor(status)
  const createdDate = formatFromWPDate(created_at) ?? -''
  const date =
    createdDate instanceof Date
      ? dateToString(createdDate, 'do MMMM yyyy hh:mm aa')
      : '-'
  const amountSent = currencyWithCode(currency, amount)

  return (
    <Pressable
      onPress={() =>
        navigation.navigate(EwaRoutes.TransctionDetails, { item })
      }>
      <HStack
        alignItems="center"
        paddingTop="20px"
        paddingBottom="15px"
        flex={1}>
        <Box
          alignSelf="center"
          width="32px"
          height="32px"
          background={'green.50'}
          backgroundColor="green.20"
          borderRadius="16px"
          alignItems="center"
          justifyContent="center"
          marginRight="16px">
          <EwaArrow color="#62A446" />
        </Box>
        <VStack flex={1}>
          <HStack justifyContent={'space-between'}>
            <Text fontSize="16px" color="navy.50">
              Earned Wage
            </Text>

            <Heading fontSize="16px" color={'navy.50'}>
              {amountSent}
            </Heading>
          </HStack>
          <HStack justifyContent={'space-between'}>
            <Text>{date}</Text>
            <Text color={statusColor} fontSize={'14px'}>
              {status ? capitalize(status) : '-'}
            </Text>
          </HStack>
        </VStack>
      </HStack>
      <Divider />
    </Pressable>
  )
}

export default EwaTransactionCard
