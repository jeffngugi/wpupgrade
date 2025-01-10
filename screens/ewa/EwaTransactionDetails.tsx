import React from 'react'
import { Box, Heading, Text } from 'native-base'
import ScreenHeader from '../../components/ScreenHeader'
import StatusAvatar from '../../components/status/StatusAvatar'
import EwaDetailCard from './components/EwaDetailCard'
import { EwaRoutes, MainNavigationProp, MainNavigationRouteProp } from '~types'
import { dateToString, formatFromWPDate } from '~utils/date'
import { currencyWithCode } from '~utils/appUtils'
import { isNull } from 'lodash'

interface Props {
  navigation: MainNavigationProp<EwaRoutes.TransctionDetails>
  route: MainNavigationRouteProp<EwaRoutes.TransctionDetails>
}

const EwaTransactionDetails = ({ navigation, route }: Props) => {
  const {
    amount,
    status,
    currency,
    created_at,
    workpay_code,
    payment_method,
    mobile,
    account_no,
  } = route.params.item
  let recipient = ''
  const createdDate = formatFromWPDate(created_at) ?? -''
  const date =
    createdDate instanceof Date
      ? dateToString(createdDate, 'do MMMM, yyyy hh:mm aa')
      : '-'

  const amnt = currencyWithCode(currency, amount)
  const method = payment_method
  if (method === 'MPESA' && !isNull(mobile)) {
    recipient = ` (${mobile})` || ''
  }
  if (method === 'BANK' && !isNull(account_no)) {
    recipient = ` (${account_no})` || ''
  }
  const paymentmethodnAccount = method + recipient

  return (
    <Box safeArea flex={1} backgroundColor="white">
      <Box marginX="16px">
        <ScreenHeader
          title="Transaction Details"
          onPress={() => navigation.goBack()}
        />
      </Box>
      <Box alignItems="center" marginY="32px">
        <StatusAvatar width={0} status={status} />
        <Heading fontSize="24px" marginTop="16px" marginBottom={'10px'}>
          {amnt ?? '-'}
        </Heading>
        <Text fontSize="16px" color={'grey'}>
          {created_at ? `Earned wage for ${date}` : '-'}
        </Text>
      </Box>
      <EwaDetailCard label="Status" value={status ?? '-'} />
      <EwaDetailCard label="Recipient" value={paymentmethodnAccount} />
      <EwaDetailCard label="Reference" value={workpay_code ?? '-'} />
      <EwaDetailCard label="Date" value={date} />
    </Box>
  )
}

export default EwaTransactionDetails
