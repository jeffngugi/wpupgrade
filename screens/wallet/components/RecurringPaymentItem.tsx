import React from 'react'
import { Box, HStack, Pressable, Text, Divider } from 'native-base'
import BankIcon from '~assets/svg/wallet-bank.svg'
import PhoneIcon from '~assets/svg/mobile.svg'
import WalletIcon from '~assets/svg/wallet-wallet.svg'
import { IRecurringPayment } from '../types'
import { currencyFormatter } from '~utils/app-utils'
import { capitalize } from 'lodash'

type Props = {
  item: IRecurringPayment
  index: number
  handlePress: () => void
}

const RecurringPaymentItem = (p: Props) => {
  const item = p.item
  const channel = item?.channel ?? ''

  const amount = currencyFormatter(
    item?.amount ?? '-',
    item?.currency_code ?? '',
  )
  const frequency = item?.frequency ?? '-'
  const accName = item?.acc_name ?? '-'
  const accNo = item?.acc_no ?? '-'

  const fullNames = `${accName} | ${accNo}`
  let Icon = WalletIcon
  let transferName = '-'
  switch (channel) {
    case 'MPESA':
      Icon = PhoneIcon
      transferName = 'Safaricom'
      break
    case 'BANK_TRANSFER':
      Icon = BankIcon
      transferName = item?.bank ?? '-'
      break
    default:
      Icon = WalletIcon
      transferName = 'Wallet'
      break
  }

  return (
    <Pressable
      flexDirection="row"
      marginY="16px"
      alignItems="flex-start"
      onPress={p.handlePress}>
      <Box alignSelf="center">
        <Icon width={24} height={24} color="#62A446" />
      </Box>
      <Box ml="16px" marginRight="auto" maxW="50%">
        <Text color="charcoal" fontSize="16px">
          {transferName}
        </Text>
        <Text>{fullNames}</Text>
      </Box>
      <HStack>
        <Divider
          width="1px"
          height="34px"
          orientation="vertical"
          bg="emerald.800"
          alignSelf="center"
        />
        <Box marginLeft="8px">
          <Text
            lineHeight="26px"
            fontSize="20px"
            fontFamily="heading"
            color="green.50">
            {amount ?? '-'}
          </Text>
          <Text lineHeight="22px">{capitalize(frequency)}</Text>
        </Box>
      </HStack>
    </Pressable>
  )
}

export default RecurringPaymentItem
