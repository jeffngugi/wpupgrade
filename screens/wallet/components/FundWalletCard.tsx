import React from 'react'
import { Box, Text } from 'native-base'
import { PayWithFlutterwave } from 'flutterwave-react-native'
import { useGetWalletUser, useVerifyCardTransaction } from '~api/wallet'
import { useNavigation } from '@react-navigation/native'
import { WalletRoutes } from '~types'

const FundWalletCard = ({
  amount,
  reference,
}: {
  amount: string
  reference: string
}) => {
  const navigation = useNavigation()
  const flutterAmount = amount as unknown as number
  const { data } = useGetWalletUser()
  const wallet = data.data.wallets[0]
  const { mutate, isLoading } = useVerifyCardTransaction()

  console.log('data is', { amount, reference })
  const handleOnRedirect = async data => {
    try {
      if (data.status === 'successful') {
        const verifyData = {
          wallet_id: wallet.uuid,
          reference,
          transaction_reference: data?.transaction_id,
        }
        mutate(verifyData, {
          onSuccess: data => {
            navigation.navigate(WalletRoutes.FundWallet)
          },
          onSettled(data, error) {
            navigation.navigate(WalletRoutes.FundWallet)
          },
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box flex={1}>
      <Box alignItems="center" mt="30px">
        <Text
          fontSize="18px"
          fontFamily="heading"
          textAlign="center"
          marginBottom="20px">
          Kindly proceed to fund with card
        </Text>
        <PayWithFlutterwave
          onRedirect={handleOnRedirect}
          options={{
            tx_ref: reference,
            authorization: 'FLWPUBK_TEST-c62874fbdd19e492f7f2fe2bcd94e971-X',
            customer: {
              email: 'skippergoroye@gmail.com',
            },
            amount: flutterAmount,
            currency: 'KES',
            payment_options: 'card',
          }}
        />
      </Box>
    </Box>
  )
}

export default FundWalletCard
