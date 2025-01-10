import React from 'react'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  WalletRoutes,
} from '~types'
import { Badge, Box, Divider, HStack, Pressable, Text } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import Icon from '~assets/svg/wallet-transaction.svg'
import { currencyWithCode } from '~utils/appUtils'
import { useWalletStatusColor } from '~utils/hooks/useEwaStatusColor'
import { capitalize } from 'lodash'
import { dateFormatter } from '~utils/date'
import { CustomStatusBar } from '~components/customStatusBar'
import DownloadIcon from '~assets/svg/wallet-download-receipt.svg'
import { useDownloadBlobWallet } from './hooks/blobDownloader'
import LoadingModal from '~components/modals/LoadingModal'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.TransactionDetail>
  route: MainNavigationRouteProp<WalletRoutes.TransactionDetail>
}

const WalletTransactionDetails = ({ route, navigation }: Props) => {
  const { uuid, status, details, currency_code, created_at, reference } =
    route.params.item
  const { downloadItem, loading } = useDownloadBlobWallet()

  const amount = details?.amount ?? 0
  const formattedAmount = currencyWithCode(currency_code, amount)
  const formattedFees = currencyWithCode(currency_code, details?.fees ?? '-')
  const formattedDate = dateFormatter(created_at, 'MMM d hh:mm aa')
  const handleDownload = () => {
    downloadItem(uuid, route.params.item)
  }

  return (
    <Box backgroundColor="white" flex={1}>
      <CustomStatusBar backgroundColor="#D6F1CA" />
      <Box
        bg={{
          linearGradient: {
            colors: ['#D6F1CA', '#82C167'],
          },
        }}
        style={{
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          paddingHorizontal: 16,
        }}>
        <ScreenHeader onPress={() => navigation.goBack()} title="" />
        <Box alignItems="center" marginBottom="20px" marginTop="32px">
          <Icon width={72} height={72} />

          <Text
            fontSize="24px"
            lineHeight="30px"
            color="#253545"
            mt="16px"
            fontFamily="heading">
            {formattedAmount}
          </Text>
          <Text color="#253545" my="10px">
            {details?.category_name ?? '-'}
          </Text>
          <Badge
            backgroundColor={useWalletStatusColor(status)}
            alignSelf="center">
            <Text fontSize="14px">{capitalize(status)}</Text>
          </Badge>
        </Box>
      </Box>
      <Box px="16px">
        <Text
          mt="32px"
          color="charcoal"
          fontFamily="heading"
          fontSize="20px"
          lineHeight="32px">
          Transaction Details
        </Text>
        <Divider marginY="14px" />
        <HStack justifyContent="space-between" my="16px">
          <Text fontSize="16px" lineHeight="19px">
            Fee
          </Text>
          <Text fontSize="16px" lineHeight="19px" color="charcoal">
            {formattedFees}
          </Text>
        </HStack>
        <HStack justifyContent="space-between" my="16px">
          <Text fontSize="16px" lineHeight="19px">
            Date/time
          </Text>
          <Text fontSize="16px" lineHeight="19px" color="charcoal">
            {formattedDate}
          </Text>
        </HStack>
        <HStack justifyContent="space-between" my="16px">
          <Text fontSize="16px" lineHeight="19px">
            Reference Id
          </Text>
          <Text fontSize="16px" lineHeight="19px" color="charcoal">
            {reference ?? '-'}
          </Text>
        </HStack>
        <HStack justifyContent="center" space="40px" marginTop="40px">
          {/* <Pressable alignItems="center">
            <ShareIcon />
            <Text lineHeight="17px" marginTop="10px">
              Share receipt
            </Text>
          </Pressable> */}
          <Pressable alignItems="center" onPress={handleDownload}>
            <DownloadIcon />
            <Text lineHeight="17px" marginTop="10px" fontSize={'16px'}>
              Download receipt
            </Text>
          </Pressable>
        </HStack>
      </Box>
      <LoadingModal isVisible={loading} message="Downloading receipt..." />
    </Box>
  )
}

export default WalletTransactionDetails
