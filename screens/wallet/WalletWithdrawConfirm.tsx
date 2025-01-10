import React, { useState } from 'react'
import ScreenContainer from '~components/ScreenContainer'
import { ScrollView, Text, Divider, Button, Box, Heading } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import { WalletConfirmItem } from './SendMoneyConfirm'
import WalletPinModal from './components/modals/WalletPinModal'
import WalletCommonModal from './components/modals/WalletCommonModal'
import OptInImg from '~assets/svg/optin-success.svg'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  WalletRoutes,
} from '~types'
import { useWalletStatus } from './hooks/useWalletStatus'
import { useTransferPin } from '~api/wallet'
import { queryClient } from '~ClientApp'
import { walletQKeys } from '~api/QueryKeys'
import { useForm } from 'react-hook-form'
import { toNumber } from 'lodash'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.WithdrawConfirm>
  route: MainNavigationRouteProp<WalletRoutes.WithdrawConfirm>
}

const WalletWithdrawConfirm = ({ navigation, route }: Props) => {
  const [successModal, setSuccessModal] = useState(false)
  const [pin, setPin] = useState('')
  const pinMutation = useTransferPin()
  const [confirmModal, setConfirmModal] = useState(false)
  const { wallet_account } = useWalletStatus()
  const { handleSubmit } = useForm()

  const withdrawData = route.params.withdrawData
  const { currency, amount, fees, uuid } = withdrawData
  const totalAmount = toNumber(amount) + toNumber(fees) ?? 0

  const handleDone = () => {
    setSuccessModal(false)
    navigation.navigate('Wallet')
  }

  console.log('Withdrawal data', withdrawData)
  const recipientName =
    withdrawData?.account_name ?? withdrawData?.recipient_name ?? '-'
  const recipientPhone = withdrawData?.account_number ?? '-'
  const isPhone = withdrawData?.payment_method === 'MPESA'

  const successMessage = `${withdrawData?.currency} ${withdrawData?.amount} has been withdrawn to ${withdrawData.account_number}`
  const onSubmitPin = () => {
    const pinConfirmData = {
      wallet_id: wallet_account?.uuid,
      transfer_id: uuid,
      pin: pin,
    }
    pinMutation.mutate(pinConfirmData, {
      onSuccess: () => {
        setConfirmModal(false)
        queryClient.invalidateQueries(walletQKeys.user)
        queryClient.invalidateQueries(walletQKeys.transactions)
        setTimeout(() => {
          setSuccessModal(true)
        }, 500)
      },
    })
  }

  return (
    <ScreenContainer>
      <ScrollView>
        <ScreenHeader
          onPress={() => navigation.goBack()}
          title="Confirm withdrawal"
        />
        <Text fontSize="16px" mt="32px">
          Your Transfer
        </Text>
        <Divider mt="8px" mb="14px" />
        <WalletConfirmItem label="You send" value={amount ?? ''} />
        <WalletConfirmItem label="Your fees" value={fees ?? '-'} />
        <WalletConfirmItem
          label="Total"
          value={currency + ' ' + totalAmount ?? ''}
        />
        <Text fontSize="16px" mt="32px">
          Recipient details
        </Text>
        <Divider mt="8px" mb="14px" />
        <WalletConfirmItem label="Name" value={recipientName} />
        <WalletConfirmItem
          label={isPhone ? 'Phone' : 'Account no'}
          value={recipientPhone}
        />
        <WalletConfirmItem
          label="Notes"
          value={withdrawData?.description ?? ''}
        />
      </ScrollView>
      <Button onPress={() => setConfirmModal(true)}>Withdraw</Button>
      <WalletCommonModal visible={successModal} setVisible={setSuccessModal}>
        <Box flex={1} alignItems="center" justifyContent="center">
          <Box my="15px">
            <OptInImg />
          </Box>
          <Heading color="white" fontSize="24px" textAlign="center">
            Withdrawal successful
          </Heading>
          <Text color="white">{successMessage}</Text>
        </Box>

        <Button
          backgroundColor="#387E1B"
          onPress={handleDone}
          marginBottom={10}>
          <Text color="white" fontSize="18px">
            Done
          </Text>
        </Button>
      </WalletCommonModal>
      <WalletPinModal
        handlePress={handleSubmit(onSubmitPin)}
        pin={pin}
        setPin={setPin}
        isLoading={pinMutation.isLoading}
        confirmModal={confirmModal}
        setConfirmModal={setConfirmModal}
      />
    </ScreenContainer>
  )
}

export default WalletWithdrawConfirm
