import React from 'react'
import GradientHeroContainer from '~components/GradientHeroContainer'
import {
  Box,
  HStack,
  Text,
  Badge,
  Divider,
  Heading,
  Progress,
} from 'native-base'
import BigDot from '~components/BigDot'
import LoanStatusFormatter from './LoanStatusFormatter'
import { LOAN_STATUSES } from '../constants'
import { currencyFormatter } from '~utils/app-utils'

type LoanDetail = {
  loan_type_name: string
  monthly_installments: number
  paid: number
  principal: number
  status: string
  currency_code: string
}

interface LoanDetailHeroProps {
  loanDetail: LoanDetail
}

const LoanDetailHero = ({ loanDetail }: LoanDetailHeroProps) => {
  const progress = loanDetail.paid / loanDetail.principal
  const PENDING = LOAN_STATUSES.PENDING.includes(loanDetail.status)
  const currencyCode = loanDetail?.currency_code
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
        </HStack>
        <Divider my="10px" backgroundColor="#BBBFC4" />
        <Text fontSize="16px">Amount {PENDING ? 'requested' : 'paid'}</Text>
        <HStack
          justifyContent="space-between"
          marginTop="10px"
          marginBottom="4px">
          {!PENDING && (
            <Heading fontSize="18px">
              {currencyFormatter(loanDetail?.paid, currencyCode)}
            </Heading>
          )}
          <Heading fontSize="18px">
            {currencyFormatter(loanDetail?.principal, currencyCode)}
          </Heading>
        </HStack>
        {!PENDING && (
          <Progress
            bg="white"
            value={loanDetail?.paid ? progress : 0}
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
