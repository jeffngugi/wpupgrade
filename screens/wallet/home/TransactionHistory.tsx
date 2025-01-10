import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { WalletRoutes } from '~types'
import { walletRenderItem } from '../WalletTransactions'
import { slice } from 'lodash'
import { IWalletTransactionItem } from '../types'
import { Box, HStack, Pressable, Heading, Text, FlatList } from 'native-base'

type TransactionHistoryProps = {
  transactions: IWalletTransactionItem[]
}

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const navigation = useNavigation()

  const firstFourTransactions = slice(transactions, 0, 4)

  return (
    <Box mt="20px" marginBottom="40px">
      <HStack justifyContent="space-between" alignItems="center">
        <Heading fontSize="16px" marginY="10px" lineHeight="26px">
          Transaction history
        </Heading>
        <Pressable
          onPress={() => navigation.navigate(WalletRoutes.Transactions)}>
          <Text fontSize="16px" color="green.50">
            See All
          </Text>
        </Pressable>
      </HStack>
      <FlatList
        mt="10px"
        data={firstFourTransactions}
        renderItem={walletRenderItem}
      />
    </Box>
  )
}

export default TransactionHistory
