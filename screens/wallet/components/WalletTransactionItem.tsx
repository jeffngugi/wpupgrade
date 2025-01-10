import React from 'react'
import { Box, HStack, Heading, Pressable, Text } from 'native-base'
import Icon from '~assets/svg/wallet-transaction.svg'
import BigDot from '~components/BigDot'
import { capitalize } from 'lodash'
import { currencyWithCode } from '~utils/appUtils'
import { formatDistance } from 'date-fns'
import { useNavigation } from '@react-navigation/native'
import { WalletRoutes } from '~types'
import { IWalletTransactionItem } from '../types'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
import { hiddenAmount } from '~utils/app-utils'

type Props = {
  item: IWalletTransactionItem
}

const WalletTransactionItem = (p: Props) => {
  const navigation = useNavigation()
  const {
    application: { showAmount: show },
  } = useSelector((state: State) => state)
  const { status, created_at, currency_code, type, details } = p.item
  const amount = details?.amount ?? 0
  const formattedAmount = currencyWithCode(currency_code, amount)

  const formattedDate = formatDistance(new Date(created_at), new Date(), {
    addSuffix: true,
  })

  return (
    <Pressable
      flexDirection="row"
      marginY="10px"
      onPress={() =>
        navigation.navigate(WalletRoutes.TransactionDetail, { item: p.item })
      }>
      <Box marginRight="8px">
        <Icon />
      </Box>
      <Box marginRight="auto">
        <Text
          fontSize="16px"
          lineHeight="24px"
          color="charcoal"
          fontFamily="body">
          {capitalize(type)}
        </Text>
        <HStack alignItems="center">
          <Text lineHeight="22px" fontSize="14px" marginRight="4px">
            {capitalize(status)}
          </Text>
          <BigDot bgColor="#D9D9D9" />
          <Text lineHeight="22px" fontSize="14px" marginLeft="4px">
            {formattedDate}
          </Text>
        </HStack>
      </Box>
      <Heading fontSize="18px" lineHeight="30px">
        {show ? formattedAmount : hiddenAmount(formattedAmount)}
      </Heading>
    </Pressable>
  )
}

export default WalletTransactionItem
