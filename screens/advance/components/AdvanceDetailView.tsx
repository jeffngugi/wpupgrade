import React from 'react'
import { Badge, Box, HStack, ScrollView, Text } from 'native-base'
import DetailItem from '~components/DetailItem'
import { currencyWithCode } from '~utils/appUtils'
import { useAdvanceStatus } from '~hooks/useAdvanceStatus'
import { dateToString } from '~utils/date'
import { useTranslation } from 'react-i18next'

const AdvanceDetailView = ({ item }) => {
  const { t } = useTranslation('advance')
  const amount = item?.amount ?? '-'
  const currencyAmount = currencyWithCode(item.currency_code, amount)
  const { status, variant } = useAdvanceStatus(item.approval_status, item.paid)
  const date = dateToString(item?.start_date, 'do, MMMM yyy')

  return (
    <Box>
      <ScrollView>
        <HStack alignItems="center" justifyContent="space-between">
          <Text fontSize="24px" color="charcoal">
            {t('title')}
          </Text>
          <Badge variant={variant}>{status}</Badge>
        </HStack>
        <Text color="charcoal" fontSize="20px">
          {currencyAmount}
        </Text>

        <Box mt={'15px'}>
          <DetailItem label={t('DateOfIssue')} value={date} />
        </Box>
        <Box>
          <DetailItem label={t('Amount')} value={currencyAmount} />
        </Box>
        <Text mt="20px" mb="4px" fontSize={'14px'} color={'grey'}>
          {t('Notes')}
        </Text>
        <Text fontSize="16px" color="charcoal">
          {item?.remarks ?? ''}
        </Text>
      </ScrollView>
    </Box>
  )
}

export default AdvanceDetailView
