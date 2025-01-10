import React, { useState } from 'react'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  WalletRoutes,
} from '~types'
import ScreenContainer from '~components/ScreenContainer'
import ScreenHeader from '~components/ScreenHeader'
import { Box, Text, Pressable, Heading, HStack } from 'native-base'
import TimerIcon from '~assets/svg/wallet-time.svg'
import { currencyFormatter } from '~utils/app-utils'
import DeleteIcon from '~assets/svg/delete.svg'
import BankIcon from '~assets/svg/wallet-bank.svg'
import WalletIcon from '~assets/svg/wallet-wallet.svg'
import MobileIcon from '~assets/svg/mobile.svg'

import { SvgProps } from 'react-native-svg'
import { capitalize, isNull } from 'lodash'
import EditDeleteRecurringModal from './components/modals/EditDeleteRecurringModal'
import { formatDate } from '~utils/date'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.RecurringDetails>
  route: MainNavigationRouteProp<WalletRoutes.RecurringDetails>
}

const RecurringPaymentDetail = ({ route, navigation }: Props) => {
  const [actionsModal, setActionModal] = useState<{
    modalOpen: boolean
    action: 'delete' | 'pause' | null
  }>({
    modalOpen: false,
    action: null,
  })
  const item = route.params.item

  const amount = currencyFormatter(
    item?.amount ?? '-',
    item?.currency_code ?? '',
  )
  const accName = item?.acc_name ?? '-'
  const accNo = item?.acc_no ?? '-'

  const fullNames = `${accName} | ${accNo}`
  // const toggleEye = () => setHidden(!hidden)

  let Icon = WalletIcon
  let transferName = '-'
  switch (item.channel) {
    case 'MPESA':
      Icon = MobileIcon
      transferName = 'Safaricom'
      break
    case 'BANK_TRANSFER':
      Icon = BankIcon
      transferName = item?.bank ?? '-'
      break
    default:
      Icon = WalletIcon
      transferName = 'Wallet'
      break
  }

  const ActionItem = (p: {
    text: string
    onPress: () => void
    Icon: React.FC<SvgProps>
  }) => {
    const Icon = p.Icon
    return (
      <Pressable onPress={p.onPress} textAlign="center" marginRight="32px">
        <Box
          width="48px"
          height="48px"
          borderRadius="24px"
          borderWidth="1"
          alignItems="center"
          justifyContent="center"
          borderColor="#E4E5E7">
          <Icon width="22px" height="22px" color="#253545" />
        </Box>
        <Text alignSelf="center" fontSize="16px" lineHeight="24px" mt="4px">
          {p.text}
        </Text>
      </Pressable>
    )
  }

  const handleCloseModal = () =>
    setActionModal({
      action: null,
      modalOpen: false,
    })

  const handleDelete = () =>
    setActionModal({
      action: 'delete',
      modalOpen: true,
    })

  /**\
   * @function below has been commented since we are not implementing the pause feature in the sprint
   */

  // const handlePause = (
  //   prevState: React.SetStateAction<{
  //     modalOpen: boolean
  //     action: 'delete' | 'pause' | null
  //   }>,
  // ) =>
  //   setActionModal({
  //     ...prevState,
  //     action: 'pause',
  //     modalOpen: true,
  //   })

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Payment Details"
        onPress={() => navigation.goBack()}
      />
      <Box flex={1} mt="16px">
        {/* <Pressable flexDirection="row" onPress={toggleEye} alignItems="center">
          <Text mr="6px">Amount</Text>
          {!hidden ? (
            <EyeOpen color="#536171" width={20} height={20} />
          ) : (
            <EyeClosed color="#536171" width={20} height={20} />
          )}
        </Pressable> */}
        <Heading
          lineHeight="30px"
          fontSize="24px"
          marginTop="16px"
          // opacity={hidden ? 1 : 0}
        >
          {amount}
        </Heading>
        {isNull(item?.next_payment_date) ? null : (
          <HStack alignItems="center" marginY="16px">
            <TimerIcon />
            <Text color="#536171" marginLeft="8px">
              Next transfer day:{' '}
              {formatDate(item?.next_payment_date, 'dayMonth')}
            </Text>
          </HStack>
        )}
        <HStack marginTop="20px">
          {/* <ActionItem text="Pause" onPress={handlePause} Icon={PauseIcon} /> */}
          {/* <ActionItem text="Edit" onPress={noop} Icon={EditIcon} /> */}
          <ActionItem text="Delete" onPress={handleDelete} Icon={DeleteIcon} />
        </HStack>
        <HStack
          marginTop="32px"
          alignItems="center"
          borderWidth={1}
          borderRadius="4px"
          borderColor="green.50"
          backgroundColor="#F1FDEB"
          padding="16px">
          <Icon color="#62A446" width={24} height={24} />

          <Box ml="14px" marginRight="auto" width="60%">
            <Text color="#253545" lineHeight="24px" fontFamily="body">
              {transferName}
            </Text>
            <Text>{fullNames}</Text>
          </Box>
          <Text>{capitalize(item?.frequency ?? '-')}</Text>
        </HStack>
      </Box>
      <EditDeleteRecurringModal
        isOpen={actionsModal.modalOpen}
        hideModal={handleCloseModal}
        item={item}
        action={actionsModal.action}
      />
    </ScreenContainer>
  )
}

export default RecurringPaymentDetail
