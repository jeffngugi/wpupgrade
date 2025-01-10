import React from 'react'
import { Box, Heading, HStack, Text } from 'native-base'
import { LinearGradient } from 'expo-linear-gradient'
import MoneyBag from '~/assets/svg/money-bag.svg'
import { SvgProps } from 'react-native-svg'
import { useSalaryAdvanceSettings } from '~api/advance'
import { useGetAdvanceLoanLimit } from '~api/advance-loans'
import { currencyFormatter } from '~utils/app-utils'

type Props = {
  label: string
  value: string
  Icon: React.FC<SvgProps>
  color1?: string
  color2?: string
  isForAdvanceLoan?: boolean
}

const ModuleHeroCard = ({
  label,
  value,
  Icon,
  color1,
  color2,
  isForAdvanceLoan = false,
}: Props) => {
  const filters = {}
  const salaryAdvaceSettings = useSalaryAdvanceSettings(filters)
  const salaryAdvaceSettingsData = salaryAdvaceSettings.data?.data
  const workpayAdvanceLimit = useGetAdvanceLoanLimit()
  const workpayAdvanceLimitData = workpayAdvanceLimit?.data?.data

  const salaryAdvanceData = isForAdvanceLoan
    ? workpayAdvanceLimitData
    : salaryAdvaceSettingsData

  return (
    <Box
      borderWidth="3px"
      borderColor="white"
      borderRadius="6px"
      mr={'21px'}
      ml={'20px'}>
      <LinearGradient
        colors={[color1 || '#F2F3F3', color2 || '#EEF5EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 6 }}>
        <HStack alignItems="center" marginX="10px">
          <Box
            width="68px"
            height="68px"
            backgroundColor="white"
            borderRadius="50px"
            marginY="20px"
            alignItems={'center'}
            justifyContent="center">
            {Icon ? <Icon /> : <MoneyBag />}
          </Box>
          <Box marginLeft="12px" maxWidth={'70%'}>
            <HStack>
              <Text fontFamily={'body'} fontSize={'14px'} color={'grey'}>
                {label}
              </Text>
            </HStack>
            <Heading fontSize="24px">
              {salaryAdvanceData?.currency_code}{' '}
              {currencyFormatter(
                salaryAdvanceData?.salary_advance_employee_limit,
              )}
            </Heading>
          </Box>
        </HStack>
      </LinearGradient>
    </Box>
  )
}

export default ModuleHeroCard
