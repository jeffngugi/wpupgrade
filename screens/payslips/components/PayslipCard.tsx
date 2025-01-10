import { useNavigation } from '@react-navigation/native'
import { Box, Pressable, Text, Badge, Divider } from 'native-base'
import React from 'react'
import { MainNavigationProp, PayslipCardProps, PayslipRoutes } from '~types'

const PayslipCard = ({
  date,
  amount,
  status,
  payslip,
  showAmount,
  isLocalPayslip,
}: PayslipCardProps) => {
  const navigation: MainNavigationProp<PayslipRoutes.SinglePayslip> =
    useNavigation()

  return (
    <Pressable
      onPress={() =>
        navigation.navigate(PayslipRoutes.SinglePayslip, {
          payslip: payslip,
          isLocalPayslip: isLocalPayslip,
        })
      }>
      <Box flexDirection="row" justifyContent="space-between" my={'24px'}>
        <Box>
          <Text fontSize={'16px'} fontFamily={'body'} color={'grey'}>
            {date ?? '-'}
          </Text>
          <Box>
            <Text
              fontSize="20px"
              color={showAmount ? 'charcoal' : 'transparent'}>
              {amount ?? '-'}
            </Text>
            <Box
              top={0}
              right={0}
              left={0}
              bottom={0}
              position="absolute"
              borderRadius={20}
              shadow={showAmount ? 100 : 9}
              backgroundColor={showAmount ? 'transparent' : '#53617010'}
            />
          </Box>
        </Box>
        {/* <Badge>
          <Text fontSize={'12px'} color={'white'}>
            {status}
          </Text>
        </Badge> */}
      </Box>
      <Divider />
    </Pressable>
  )
}

export default PayslipCard
