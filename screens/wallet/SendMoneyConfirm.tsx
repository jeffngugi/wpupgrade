import React, { useState } from 'react'
import ScreenContainer from '~components/ScreenContainer'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  WalletRoutes,
} from '~types'
import ScreenHeader from '~components/ScreenHeader'
import {
  Button,
  Divider,
  HStack,
  ScrollView,
  Text,
  Box,
  Pressable,
  Heading,
  useToast,
} from 'native-base'
import {
  useCreateWalletBeneficiary,
  useGetWalletUser,
  useTransferPin,
} from '~api/wallet'
import { useForm } from 'react-hook-form'
import { toNumber } from 'lodash'
import WalletCommonModal from './components/modals/WalletCommonModal'
import PlanIcon from '~assets/svg/paper-plane.svg'
import WalletPinModal from './components/modals/WalletPinModal'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.SendMoneyConfirm>
  route: MainNavigationRouteProp<WalletRoutes.SendMoneyConfirm>
}

const SendMoneyConfirm = ({ route, navigation }: Props) => {
  const [confirmModal, setConfirmModal] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const { control, handleSubmit } = useForm()
  const { mutate, isLoading } = useTransferPin()
  const beneficiary = useCreateWalletBeneficiary()
  const { data: walletData } = useGetWalletUser()
  const [pin, setPin] = useState('')
  const toast = useToast()
  const sendToId = route.params.sendToId
  const { description, wallet_id, account_name, bank_id, payment_method } =
    route.params.sendToData //
  const { amount, account_number, fees, currency, name, uuid } =
    route.params.successData //data from previous mutation response
  const displayName = route.params.displayName

  const beneficiaryData = {
    user_uuid: walletData?.data?.uuid,
    name: displayName || account_number,
    acc_name: displayName || account_number,
    acc_no: account_number,
    channel: payment_method,
    bank_id,
    type: 'TRANSFER',
  }

  const onSubmit = formData => {
    const submitData = {
      wallet_id,
      transfer_id: uuid,
      pin: pin,
    }

    mutate(submitData, {
      onSuccess: data => {
        setConfirmModal(false)
        setTimeout(() => setSuccessModal(true), 400)
      },
    })
  }

  const handleSaveBeneficiary = () => {
    beneficiary.mutate(beneficiaryData, {
      onSuccess: data => {
        navigation.navigate('Wallet')
        toast.show({
          title: 'Added successfully, continue',
          placement: 'top',
        })
      },
      onSettled: () => {
        navigation.navigate('Wallet')
      },
    })
  }

  const handleContinue = () => {
    navigation.navigate('Wallet')
  }
  const totalAmount = toNumber(amount) + toNumber(fees) ?? 0

  const handlePress = handleSubmit(onSubmit)

  let sendTo = '-'

  switch (sendToId) {
    case 'bank':
      sendTo = 'Account number'
      break
    case 'mobile':
      sendTo = 'Phone'
      break
    case 'wallet':
      sendTo = 'Wallet Id'
      break
    default:
      break
  }

  return (
    <ScreenContainer>
      <ScrollView>
        <ScreenHeader
          onPress={() => navigation.goBack()}
          title="Confirm transfer"
        />
        <Text fontSize="16px" mt="32px">
          Your Transfer
        </Text>
        <Divider mt="8px" mb="14px" />
        <WalletConfirmItem
          label="You send"
          value={currency + ' ' + amount ?? ''}
        />
        <WalletConfirmItem
          label="Your fees"
          value={currency + ' ' + fees ?? ''}
        />
        <WalletConfirmItem
          label="Total"
          value={currency + ' ' + totalAmount ?? ''}
        />
        <Text fontSize="16px" mt="32px">
          Recipient details
        </Text>
        <Divider mt="8px" mb="24px" />
        <WalletConfirmItem label="Name" value={displayName ?? '-'} />
        <WalletConfirmItem label={sendTo} value={account_number ?? ''} />
        <WalletConfirmItem label="Notes" value={description ?? '-'} />
      </ScrollView>
      <Button onPress={() => setConfirmModal(true)}>Transfer</Button>
      <WalletPinModal
        handlePress={handlePress}
        pin={pin}
        setPin={setPin}
        isLoading={isLoading}
        confirmModal={confirmModal}
        setConfirmModal={setConfirmModal}
      />
      <WalletCommonModal visible={successModal} setVisible={setSuccessModal}>
        <Box flex={1} alignItems="center" justifyContent="center">
          <Box my="15px">
            <PlanIcon />
          </Box>
          <Heading color="white" fontSize="32px" textAlign="center">
            Your transfer request is successful
          </Heading>
          <Text color="white" my="5px">
            You will be notified once the transfer has been completed
          </Text>
          <Pressable
            onPress={handleSaveBeneficiary}
            backgroundColor="white"
            paddingX="12px"
            paddingY="6px"
            borderRadius="28px"
            mt="20px">
            <Text fontSize="16px" color="green.50">
              Save beneficiary
            </Text>
          </Pressable>
        </Box>

        <Button backgroundColor="#387E1B" onPress={handleContinue}>
          Done
        </Button>
        <Pressable
          marginTop="32px"
          marginBottom="16px"
          onPress={() => navigation.navigate(WalletRoutes.SendMoney)}>
          <Text color="white" textAlign="center" fontSize="16px">
            Make another payment
          </Text>
        </Pressable>
      </WalletCommonModal>
    </ScreenContainer>
  )
}

export default SendMoneyConfirm

export const WalletConfirmItem = (p: { label: string; value: string }) => {
  return (
    <HStack my="10px" justifyContent="space-between" alignItems="center">
      <Text fontSize="16px" lineHeight="24px">
        {p.label}
      </Text>
      <Text
        fontSize={p.label === 'Total' ? '30px' : '16px'}
        lineHeight={p.label === 'Total' ? '30px' : '24px'}
        color="charcoal">
        {p.value}
      </Text>
    </HStack>
  )
}
