import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  FlatList,
  HStack,
  Divider,
  Text,
  Pressable,
  Image,
  Heading,
  Button,
} from 'native-base'
import FundSourceHeader from './FundSourceHeader'
import MobileIcon from '~assets/svg/mobile.svg'
import {
  TMobileMProvider,
  useMobileMoneyProviders,
} from '../data/useWalletData'
import { ListRenderItem } from 'react-native'
import FundMpesaModal from '~components/modals/FundMpesaModal'
import WalletListBox from './WalletListBox'
import WalletCommonModal from './modals/WalletCommonModal'
import OptInImg from '~assets/svg/optin-success.svg'
import { usePollMpesaPayment, usePollVerifyMpesaPayment } from '~api/wallet'
import { useNavigation } from '@react-navigation/native'
import { isEmpty } from 'lodash'

const img = require('~assets/svg/mpesa.png')

type Props = {
  amount: string
}

const FundWalletMpesa = ({ amount }: Props) => {
  const { data: providersData } = useMobileMoneyProviders()
  const [modalOpen, setModalOpen] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [title, setTitle] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [mpesaReference, setMpesaReference] = useState('')
  const [isForm, setIsForm] = useState(true)
  const [transactionSuccessful, setTransactionSuccessful] = useState(false)
  const navigation = useNavigation()

  const { data, isLoading, mutate } = usePollMpesaPayment()

  const { mutate: verifyPayment, isLoading: isVerifying } =
    usePollVerifyMpesaPayment()

  const [failedStatus, setFailedStatus] = useState(false)
  const [{ isLoadingPoll, count }, setIsLoadingPoll] = useState({
    isLoadingPoll: true && !isEmpty(mpesaReference),
    count: 1,
  })

  const verifyMpesa = () => {
    verifyPayment(
      {
        reference: mpesaReference,
      },
      {
        onSuccess: response => {
          if (response?.success) {
            setSuccessMessage(response?.message)
            setSuccessModal(true)
          }
        },
      },
    )
  }

  const confirmPayment = () => {
    mutate(
      { reference: mpesaReference },
      {
        onSuccess: response => {
          if (response?.data?.status === 'SUCCESS') {
            setModalOpen(false)
            setTimeout(() => {
              setSuccessModal(true)
              setIsLoadingPoll(prev => ({ ...prev, isLoadingPoll: false }))
            }, 600)
            setIsForm(true)
          }
        },
      },
    )
  }

  const pollRef = useRef({ id: null } as { id: number | null | Date })

  useEffect(() => {
    const pollRequest = () => {
      if (pollRef?.current?.id === null) {
        if (mpesaReference) {
          pollRef.current.id = new Date()
          confirmPayment()
        }
      } else {
        if (count >= 10) {
          setIsLoadingPoll(prev => ({ ...prev, isLoadingPoll: false }))
          setFailedStatus(true)
          setTitle('Confirmation failed')
          setSuccessMessage(
            'We could not confirm your payment at the moment Click the button bellow to confirm',
          )
          return
        }

        if (data?.data?.status === 'FAILED') {
          setFailedStatus(true)
          setIsLoadingPoll(prev => ({
            ...prev,
            isLoadingPoll: false,
            count: 10,
          }))
          setTitle('Request failed')
          setSuccessMessage(
            'Your transaction could not be handled at this moment. Please try again later',
          )
          return
        } else if (data?.data?.status !== 'SUCCESS' && !isLoading) {
          setIsLoadingPoll(prev => ({
            ...prev,
            count: count + 1,
            isLoadingPoll: true,
          }))
          setTimeout(confirmPayment, 3000)
          return
        }
      }
    }
    return pollRequest()
  }, [isLoading, pollRef?.current?.id, data?.data?.status, mpesaReference])

  const handlePress = () => {
    setModalOpen(true)
    setIsForm(true)
    setIsLoadingPoll(prev => ({ ...prev, isLoadingPoll: false, count: 1 }))
  }

  const handleDone = () => {
    setSuccessModal(false)
    navigation?.navigate('Wallet')
  }

  const renderItem: ListRenderItem<TMobileMProvider> = ({ item }) => {
    return <FundMpesaItem item={item} onPress={handlePress} />
  }
  return (
    <Box flex={1} backgroundColor="red">
      <Box alignItems="center" mt="30px">
        <FundSourceHeader
          Icon={MobileIcon}
          source="Mobile money"
          description="Make a transfer to the account number and your wallet will be funded immediately."
        />
      </Box>
      <WalletListBox marginTop="48px">
        <FlatList
          data={providersData}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
        />
      </WalletListBox>
      <FundMpesaModal
        hideModal={() => setModalOpen(false)}
        isOpen={modalOpen}
        amount={amount}
        setMpesaReference={setMpesaReference}
        isPolling={isLoadingPoll || isVerifying || isLoading}
        isForm={isForm}
        setIsForm={setIsForm}
        title={title}
        successMsg={successMessage}
        setTitle={setTitle}
        setSuccessMsg={setSuccessMessage}
        confirmPayment={verifyMpesa}
      />

      <WalletCommonModal visible={successModal} setVisible={setSuccessModal}>
        <Box flex={1} alignItems="center" justifyContent="center">
          <Box my="15px">
            <OptInImg />
          </Box>
          <Heading color="white" fontSize="24px" textAlign="center">
            Your Top up is successful
          </Heading>
          <Text color="white">Ksh {amount} has been added to your wallet</Text>
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
    </Box>
  )
}

export default FundWalletMpesa

export const FundMpesaItem = ({
  item,
  onPress,
}: {
  item: TMobileMProvider
  onPress: () => void
}) => {
  const { Icon, name } = item
  return (
    <HStack alignItems="center" marginY="20px" mx="20px">
      <Image source={img} alt="grant" width={12} height={12} />
      {/* <Icon /> */}
      <Text fontSize="16px" mr="auto" ml="16px">
        {name}
      </Text>
      <Pressable
        borderRadius="4px"
        backgroundColor="green.50"
        px="18px"
        height="32px"
        justifyContent="center"
        onPress={onPress}>
        <Text color="white" fontSize="14px">
          Pay
        </Text>
      </Pressable>
    </HStack>
  )
}
