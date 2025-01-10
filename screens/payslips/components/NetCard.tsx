import { Box, Heading, HStack, Pressable, Text } from 'native-base'
import React, { Dispatch, SetStateAction, useState } from 'react'
import MoneyBag from '../../../assets/svg/money-bag.svg'
import Eye from '../../../assets/svg/eye.svg'
import EyeOff from '../../../assets/svg/eye-off.svg'
import { LinearGradient } from 'expo-linear-gradient'

type Props = {
  loading: boolean
  latestNetPay: number | string
  latestCurrencyCode: string | undefined
  showAmount: boolean
  setShowAmount: Dispatch<SetStateAction<boolean>>
}

const NetCard = ({
  loading,
  latestNetPay,
  latestCurrencyCode,
  showAmount,
  setShowAmount,
}: Props) => {
  const latestNetPayFixed = latestNetPay

  return (
    <Box
      marginX="20px"
      borderWidth="3px"
      borderColor="white"
      background={'yellow'}
      marginTop={'24px'}
      marginBottom={'37px'}
      // shadow={1}
      borderRadius="6px">
      <LinearGradient
        colors={['#DBE6F5', '#EEF5EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 6 }}>
        <HStack alignItems="center" marginX="16px">
          <Box
            width="68px"
            height="68px"
            backgroundColor="white"
            borderRadius="50px"
            marginY="20px"
            alignItems={'center'}
            justifyContent="center">
            <MoneyBag />
          </Box>
          <Box marginLeft="12px">
            <HStack>
              <Text fontFamily={'body'} fontSize={'14px'} color={'grey'}>
                Net Salary
              </Text>
              <Pressable
                onPress={() => setShowAmount(!showAmount)}
                paddingX="10px">
                {!showAmount ? (
                  <Eye color="#536171" width={18} />
                ) : (
                  <EyeOff color="#536171" width={18} />
                )}
              </Pressable>
            </HStack>
            <Box>
              <Heading
                fontSize="24px"
                color={showAmount ? 'charcoal' : 'transparent'}>
                {loading ? null : latestNetPay}{' '}
              </Heading>
              <Box
                top={0}
                right={0}
                left={0}
                bottom={0}
                position="absolute"
                shadow={showAmount ? 100 : 9}
                borderRadius={50}
                backgroundColor={showAmount ? 'transparent' : '#53617010'}
              />
            </Box>
          </Box>
        </HStack>
      </LinearGradient>
    </Box>
  )
}

export default NetCard
