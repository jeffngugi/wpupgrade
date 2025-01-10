import React from 'react'
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Progress,
  Text,
} from 'native-base'
import EwaWalletIcon from '../../../assets/svg/ewa-wallet.svg'
import BankIcon from '../../../assets/svg/m-pesa.svg'
import MpesaIcon from '../../../assets/svg/bank-icon.svg'
import ToWalletIcon from '../../../assets/svg/to-wallet.svg'

import { useNavigation } from '@react-navigation/native'
import { EwaRoutes, EwaSendMethods, MainNavigationProp } from '~types'
import { Actionsheet, useDisclose } from 'native-base'
import SendToLink from './SendToLink'
import { useEwaEarning } from '~api/ewa'
import { useMyProfile } from '~api/account'
import { dateToString, fromBackedDate } from '~utils/date'
import { isUndefined, noop } from 'lodash'
import { currencyWithCode } from '~utils/appUtils'
import { useWalletStatus } from '~screens/wallet/hooks/useWalletStatus'

const EwaHomeCardInfo = () => {
  const navigation = useNavigation<MainNavigationProp<EwaRoutes.Ewa>>()
  const { data } = useEwaEarning()
  const emp = useMyProfile()
  const { isActive } = useWalletStatus()
  const { isOpen, onOpen, onClose } = useDisclose()
  const handleToMpesa = () => {
    navigation.navigate(EwaRoutes.SendMoney, {
      ewaSendMethod: EwaSendMethods.mpesa,
    })
    onClose()
  }

  const handleToBank = () => {
    navigation.navigate(EwaRoutes.SendMoney, {
      ewaSendMethod: EwaSendMethods.bank,
    })
    onClose()
  }

  const handleToWallet = () => {
    navigation.navigate(EwaRoutes.SendMoney, {
      ewaSendMethod: EwaSendMethods.wallet,
    })
    onClose()
  }
  const currencyCode = emp?.data?.data?.currency_code ?? ''
  const startDate = fromBackedDate(data?.data?.start_date)
  const endDate = fromBackedDate(data?.data?.end_date)
  const start = !isUndefined(startDate)
    ? dateToString(startDate, 'MMMM do')
    : '-'
  const end = !isUndefined(endDate) ? dateToString(endDate, 'MMMM do') : '-'
  const nextCut = fromBackedDate(data?.data?.next_cut_off)
  const nextCutOff = !isUndefined(nextCut)
    ? dateToString(nextCut, 'MMMM do, yyy')
    : '-'

  const availableForWithdraw = currencyWithCode(
    currencyCode,
    data?.data?.available_for_withdraw,
  )

  const earnedAmount = currencyWithCode(currencyCode, data?.data?.earned_amount)
  const salary = currencyWithCode(currencyCode, data?.data?.salary)

  return (
    <Box
      padding="20px"
      flex={1}
      position="absolute"
      bottom="0"
      left="0"
      right="0"
      top="0"
      bg={{
        linearGradient: {
          colors: ['rgba(242,243,243, 0.5)', 'rgba(238,245,235, 0.5)'],
          start: [0, 0],
          end: [0, 0],
        },
      }}>
      <HStack alignItems="center">
        <Box
          marginRight="16px"
          width="40px"
          height="40px"
          borderRadius="6px"
          backgroundColor="white"
          alignItems="center"
          justifyContent="center">
          <EwaWalletIcon color="#62A446" />
        </Box>
        <Box>
          <Text fontSize="18px" color="charcoal">
            Amount earned
          </Text>
          <Text fontSize="14px">
            {start} - {end}
          </Text>
        </Box>
      </HStack>
      <HStack
        justifyContent="space-between"
        marginTop="30px"
        marginBottom="4px">
        <Heading fontSize="18px" color={'navy.50'}>
          {earnedAmount}
        </Heading>
        <Heading fontSize="18px" color={'#72777B'}>
          {salary}
        </Heading>
      </HStack>
      <Progress
        bg="white"
        value={50}
        _filledTrack={{
          bg: 'green.50',
        }}
      />
      <Text marginTop="18px" marginBottom="18px" fontSize={'14px'}>
        Next cut off on {nextCutOff}
      </Text>
      <Divider bg="#9FC191" />
      <Text
        alignSelf="center"
        marginTop="16px"
        fontSize={'12px'}
        color={'navy.50'}>
        Available amount
      </Text>
      <Heading
        fontSize={'24px'}
        alignSelf="center"
        marginBottom="16px"
        color={'green.70'}>
        {availableForWithdraw}
      </Heading>
      <Button
        onPress={onOpen}
        height="48px"
        _text={{ fontFamily: 'heading', fontSize: '16px' }}>
        Send
      </Button>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content backgroundColor="white">
          <Box width="100%" marginLeft="10px" paddingBottom={'30px'}>
            <Text fontSize="20px" color="charcoal" marginY={'10px'}>
              Send
            </Text>
            <SendToLink
              onPress={handleToMpesa}
              title="Send to Mpesa"
              label="Send funds to your mpesa"
              Icon={BankIcon}
            />
            <SendToLink
              onPress={handleToBank}
              title="Send to Bank"
              label="Link your bank account"
              Icon={MpesaIcon}
            />
            <SendToLink
              onPress={isActive ? handleToWallet : noop}
              title="Send to Wallet"
              label="Send money to your wallet"
              Icon={ToWalletIcon}
              comingSoon={!isActive}
            />
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  )
}

export default EwaHomeCardInfo
