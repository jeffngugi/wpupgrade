import React from 'react'
import { Box, HStack, Text } from 'native-base'
import MpesaIcon from '~assets/svg/m-pesa.svg'
import BankIcon from '~assets/svg/ewa-bank.svg'
import { EwaSendMethods, TEwaSubmitData } from '~types'
import { useWalletStatus } from '~screens/wallet/hooks/useWalletStatus'

const EwaReviewHeader = ({ data }: { data: TEwaSubmitData }) => {
  const { wallet_account, data: walletData } = useWalletStatus()
  const profile = walletData?.data?.profile
  const user = `${profile?.first_name} ${profile?.last_name}`

  const { payment_method, acc_no, accName, recipient_number } = data
  let name = '-'
  let account = ''
  switch (payment_method) {
    case EwaSendMethods.bank:
      name = accName ?? '-'
      account = acc_no as string
      break
    case EwaSendMethods.mpesa:
      account = recipient_number ?? '-'
      break
    case EwaSendMethods.wallet:
      account = wallet_account?.acc_no ?? '-'
      name = user ?? ''
      break
    default:
      break
  }

  return (
    <Box shadow={1} marginY="16px">
      <Box
        width="100%"
        borderRadius="13px"
        borderWidth="3px"
        borderColor="white"
        padding="16px"
        bg={{
          linearGradient: {
            colors: ['#E0ECF1', '#DEEDD8'],
            start: [0, 0],
            end: [1, 1],
          },
        }}>
        <HStack alignItems="center">
          {payment_method === EwaSendMethods.mpesa ? (
            <MpesaIcon />
          ) : (
            <BankIcon />
          )}
          <Box marginLeft="16px">
            <Text fontSize="16px" color="navy.50" fontFamily={'heading'}>
              {account}
            </Text>
            <Text fontSize={'14px'} color={'grey'}>
              {name}
            </Text>
          </Box>
        </HStack>
      </Box>
    </Box>
  )
}

export default EwaReviewHeader
