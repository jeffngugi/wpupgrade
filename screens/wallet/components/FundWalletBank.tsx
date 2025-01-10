import React, { useState } from 'react'
import { Box, FlatList, Pressable, Text, Button } from 'native-base'
import FundSourceHeader from './FundSourceHeader'
import BankIcon from '~assets/svg/wallet-bank.svg'
import CopyIcon from '~assets/svg/Copy.svg'
import copyToClipboard from '~utils/copyUtil'
import { TwpBankAccount, wpBankAccounts } from '../data/useWalletData'
import { ListRenderItem } from 'react-native'
import ProofOfPaymentModal from './modals/ProofOfPaymenentModal'
import { useGetWpPayPoints } from '~api/general'

const FundWalletBank = ({ amount }: { amount: string }) => {
  useGetWpPayPoints()

  const renderItem: ListRenderItem<TwpBankAccount> = ({ item }) => {
    return <FundBankItem item={item} />
  }

  const [modalOpen, setModalOpen] = useState(false)
  return (
    <Box flex={1}>
      <Box alignItems="center" mt="30px">
        <FundSourceHeader
          Icon={BankIcon}
          source="Bank transfer"
          description="Transfer funds to any of the bank accounts above and submit payment information below. You will be notified once your balance has been updated."
        />
      </Box>
      <Box mt="20px" flex={1}>
        <FlatList
          data={wpBankAccounts}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </Box>
      <Button onPress={() => setModalOpen(true)}>I've made a payment</Button>
      <ProofOfPaymentModal
        hideModal={() => setModalOpen(false)}
        isOpen={modalOpen}
        amount={amount}
      />
    </Box>
  )
}

export default FundWalletBank

export const FundBankItem = ({ item }: { item: TwpBankAccount }) => {
  return (
    <Pressable
      alignItems="center"
      marginY="15px"
      flexDirection="row"
      onPress={() => copyToClipboard(item.accNo, 'Account number copied')}>
      <Box mr="auto">
        <Text lineHeight="22px" fontSize="16px" mt="4px" color="green.50">
          {item.name}
        </Text>
        <Text fontSize="14px" lineHeight="22px" color="charcoal" marginY="2px">
          Acc Name: {item.accName}
        </Text>
        <Text fontSize="14px" lineHeight="22px" color="charcoal">
          Acc No: {item.accNo}
        </Text>
      </Box>
      <CopyIcon color="#62A446" />
    </Pressable>
  )
}
