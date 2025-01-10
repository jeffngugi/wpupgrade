import React, { useCallback, useEffect, useRef } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import WalletHomeHeader from './components/WalletHomeHeader'
import WalletHomeCarousel from './components/WalletHomeCarousel'
import WalletQuickItems from '../components/WalletQuickItems'
import { Box, Heading, ScrollView, Image } from 'native-base'

import { CustomStatusBar } from '~components/customStatusBar'
import TransactionHistory from './TransactionHistory'
import WalletMore from '../components/WalletMore'
import BellIcon from '~assets/svg/notification.svg'
import LinkToCardImage from '~assets/images/link-to-bank.png'

import { LogBox, Pressable, RefreshControl } from 'react-native'
import {
  useEnableWalletPayment,
  useGetLinkedAccounts,
  useGetWalletTransactions,
} from '~api/wallet'
import { walletQKeys } from '~api/QueryKeys'
import { queryClient } from '~ClientApp'
import { useNavigation } from '@react-navigation/native'
import { WalletRoutes } from '~types'
import { useWalletStatus } from '../hooks/useWalletStatus'
import copyToClipboard from '~utils/copyUtil'

import { useMyProfile } from '~api/account'
import { getItem } from '~storage/device-storage'
import ReceiveSalaryModal from './components/ReceiveSalaryModal'
import ReceiveSalarySuccessModal from './components/ReceiveSalarySuccessModal'

const WalletHome = () => {
  const navigation = useNavigation()
  const { data, wallet } = useWalletStatus()
  const { data: linkedAccounts, isLoading: loadingLinkedAccounts } =
    useGetLinkedAccounts()
  const { data: employeeDetails, isLoading: isLoadingProfile } = useMyProfile()
  const { mutate, isLoading } = useEnableWalletPayment()
  const isWalletPaymentMethodEnabled =
    employeeDetails?.data?.bank_details?.payment_method === 'WALLET'
  const showLinkAccountCard =
    !loadingLinkedAccounts && !linkedAccounts?.data?.length

  const walletParams = {
    wallet_id: wallet?.uuid,
    records_per_page: 5,
    page: 1,
  }

  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
    isRefetching,
  } = useGetWalletTransactions(walletParams)

  const transactions = transactionsData?.data?.data ?? []

  const [refreshing, setRefreshing] = React.useState(false)
  const [receiveSalaryModalOpen, setReceiveSalaryModalOpen] =
    React.useState(false)
  const [receiveSalarySuccessModalOpen, setReceiveSalarySuccessModalOpen] =
    React.useState(false)

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
  }, [])

  const checkIsWalletModalDismissed = async () => {
    await getItem('isWalletModalDismissed').then((res: unknown) => {
      if (res === 'true') {
        setReceiveSalaryModalOpen(false)
      } else if (!isWalletPaymentMethodEnabled) {
        setReceiveSalaryModalOpen(true)
      }
    })
  }

  useEffect(() => {
    checkIsWalletModalDismissed()
  }, [isLoadingProfile, isWalletPaymentMethodEnabled])

  const onRefresh = () => {
    refetchTransactions()
    queryClient.invalidateQueries([walletQKeys.user])
  }

  const handleEnableWalletClick = () => {
    mutate({} as any, {
      onSuccess: () => {
        queryClient.invalidateQueries([walletQKeys.user])
        setReceiveSalaryModalOpen(false)
        setTimeout(() => {
          setReceiveSalarySuccessModalOpen(true)
        }, 1000)
      },
    })
  }

  useGetLinkedAccounts()

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor="white" />
      <Box flex={1} backgroundColor="white">
        <Box px="16px">
          <WalletHomeHeader
            onPress={() => navigation.navigate(WalletRoutes.Notifications)}
            title="Wallet"
            subTitle={`${data?.data?.profile?.first_name ?? '-'} ${
              data?.data?.profile?.last_name ?? '-'
            }  |  ${wallet.acc_no ?? '-'}`}
            Icon={BellIcon}
            onPressCopy={() => copyToClipboard(wallet.acc_no)}
          />
        </Box>
        <ScrollView
          flex={1}
          pt="4px"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={'green'}
            />
          }>
          <Box px="16px">
            <WalletHomeCarousel />

            <WalletQuickItems />
          </Box>
          {/* <WalletSpendOverview /> */}
          {showLinkAccountCard ? (
            <>
              <Pressable
                onPress={() => {
                  navigation.navigate(WalletRoutes.LinkAccount)
                }}>
                <Box
                  height={'150px'}
                  width={'100%'}
                  justifyContent="space-between">
                  <Image
                    source={LinkToCardImage}
                    resizeMethod="resize"
                    resizeMode="contain"
                    alt="LinkBank"
                  />
                </Box>
              </Pressable>
              <Box marginY="20px" />
            </>
          ) : null}
          <Box px="16px">
            {/* <WalletSpendOverview /> */}
            <Box height={'30px'} />
            <TransactionHistory transactions={transactions} />
            <WalletMore />
          </Box>
          <Box marginY="20px" />
        </ScrollView>
      </Box>
      <ReceiveSalaryModal
        isOpen={receiveSalaryModalOpen}
        hideModal={() => {
          setReceiveSalaryModalOpen(false)
        }}
        handleClick={handleEnableWalletClick}
        isLoading={isLoading}
      />
      <ReceiveSalarySuccessModal
        isOpen={receiveSalarySuccessModalOpen}
        hideModal={() => {
          setReceiveSalarySuccessModalOpen(false)
        }}
      />
    </SafeAreaProvider>
  )
}

export default WalletHome
