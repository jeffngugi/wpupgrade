import { LinearGradient } from 'expo-linear-gradient'
import { Box, Divider, Heading, HStack, Text } from 'native-base'
import React from 'react'

const PaymentDetails = ({
  name,
  bank,
  date,
  netPay,
}: {
  name: string
  bank: string
  date: string
  netPay: string
}) => {
  const paymentDetails = [
    { name: 'Name:', value: name ?? '-' },
    { name: 'Bank details:', value: bank ?? '' },
    { name: 'Date:', value: date ?? '-' },
  ]
  return (
    <Box
      borderRadius="6px"
      borderWidth="3px"
      borderColor="white"
      shadow={1}
      mt={'24px'}>
      <LinearGradient
        colors={['#DBE6F5', '#EEF5EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 0 }}>
        <Text fontSize="18px" color="charcoal" marginX="20px" marginY="10px">
          Payment Details
        </Text>
        <Divider color="white" height={'2px'} />
        {/* <Box borderColor="white" bo width="100%" height={'4px'} /> */}
        <Box marginX="20px" marginY="14px">
          <Text fontSize={'14px'} color={'grey'}>
            Net Pay
          </Text>
          <Heading marginBottom="30px" fontSize={'24px'} color={'charcoal'}>
            {netPay || '-'}
          </Heading>
          {paymentDetails.map((item, index) => (
            <HStack alignItems={'center'} marginY="10px" key={index.toString()}>
              <Box width="30%">
                <Text fontSize={'14px'} color={'grey'}>
                  {item.name}
                </Text>
              </Box>
              <Text color="charcoal" fontSize="16px" maxW={'80%'}>
                {item.value}
              </Text>
            </HStack>
          ))}
        </Box>
      </LinearGradient>
    </Box>
  )
}

export default PaymentDetails
