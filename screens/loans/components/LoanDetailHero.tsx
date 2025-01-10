import React from 'react'
import GradientHeroContainer from '~components/GradientHeroContainer'
import { Box, HStack, Text, Divider, Heading, Progress } from 'native-base'
import LoanStatusFormatter from './LoanStatusFormatter'
import { LOAN_STATUSES } from '../constants'
import { currencyFormatter } from '~utils/app-utils'
import { TLoan } from '../types'
import Tag from './Tag'
import { includes } from 'lodash'

const LoanDetailHero = ({ loanDetail }: { loanDetail: TLoan }) => {
  const PENDING = LOAN_STATUSES.PENDING.includes(loanDetail.status)
  const currencyCode = loanDetail?.currency_code
  const totalAmount = loanDetail.total_amount
    ? parseFloat(loanDetail.total_amount)
    : 0
  const loanBalance = loanDetail.loan_balance
    ? parseFloat(loanDetail.loan_balance)
    : 0
  const principleAmount = loanDetail.principal
    ? parseFloat(loanDetail.principal)
    : 0

  const paidAmount = totalAmount - loanBalance
  const percentage = (paidAmount / totalAmount) * 100
  const amount = PENDING ? principleAmount : totalAmount
  const tagName = loanDetail?.funding_type === 'CLIENT' ? 'Company' : 'Workpay'
  const hideBar = includes(
    [LOAN_STATUSES.INACTIVE, LOAN_STATUSES.PENDING, 'CERTIFIED'],
    loanDetail.status,
  )
  return (
    <GradientHeroContainer>
      <Box p="20px">
        <HStack alignItems="center">
          <Text
            color="charcoal"
            fontSize="20px"
            mr="8px"
            alignSelf={'center'}
            fontFamily={'heading'}>
            {loanDetail?.loan_type_name}
          </Text>
          <LoanStatusFormatter status={loanDetail?.status} />
        </HStack>
        <HStack alignItems="center" my="4px">
          <Text fontSize="16px" color={'charcoal'}>
            {currencyFormatter(loanDetail?.monthly_installments, currencyCode)}
            /mo
          </Text>
          {/* <BigDot /> */}
          {/* <Text fontSize="16px"> months left</Text> */}
        </HStack>
        <Divider my="10px" backgroundColor="#BBBFC4" />
        <HStack>
          <Text fontSize="16px">Amount {hideBar ? 'requested' : 'paid'}</Text>
          <Tag tagName={tagName} />
        </HStack>

        <HStack
          justifyContent="space-between"
          marginTop="10px"
          marginBottom="4px">
          {!hideBar && (
            <Heading fontSize="18px" color="charcoal">
              {currencyFormatter(paidAmount, currencyCode)}
            </Heading>
          )}
          <Heading
            fontSize={hideBar ? '18px' : '16px'}
            color={hideBar ? 'charcoal' : '#72777B'}>
            {currencyFormatter(amount, currencyCode)}
          </Heading>
        </HStack>
        {!hideBar && (
          <Progress
            bg="white"
            value={percentage ?? 0}
            _filledTrack={{
              bg: 'green.50',
            }}
          />
        )}
      </Box>
    </GradientHeroContainer>
  )
}

export default LoanDetailHero
