import React, { useState } from 'react'
import { Box, HStack, Heading, Pressable, Text } from 'native-base'
import QuickItem from '~components/QuickItem'
import SendIcon from '~assets/svg/wallet-send.svg'
import SaveIcon from '~assets/svg/wallet-save.svg'
import PayIcon from '~assets/svg/wallet-paybill.svg'
import MerchantIcon from '~assets/svg/wallet-merchant.svg'
import { SvgProps } from 'react-native-svg'
import { WalletRoutes } from '~types'
import { useNavigation } from '@react-navigation/native'
import WithdrawToLinkedModal from './modals/WithdrawToLinkedModal'
import ChevIcon from '~assets/svg/chev-r.svg'
import SendIcon2 from '~assets/svg/action-send.svg'

export type TWalletItem = {
  label: string
  Icon: React.FC<SvgProps>
  route: string | null
}

const item = {
  label: 'Send Money',
  Icon: SendIcon,
  route: WalletRoutes.SendMoney,
}

const walletItems: TWalletItem[] = [
  {
    label: 'Send Money',
    Icon: SendIcon,
    route: WalletRoutes.SendMoney,
  },
  {
    label: 'Withdraw',
    Icon: SaveIcon,
    route: null,
  },
  // {
  //   label: 'Pay Bills',
  //   Icon: PayIcon,
  //   route: null,
  // },
  {
    label: 'Pay Merchant',
    Icon: MerchantIcon,
    route: WalletRoutes.Merchant,
  },
]

const WalletQuickItems = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const navigation = useNavigation()
  const handleNavigate = (item: TWalletItem) => {
    if (item.label === 'Withdraw') {
      setModalOpen(true)
    }
    if (item.route) {
      navigation.navigate(item.route)
    }
  }

  const ActionItem = (p: {
    title: string
    send?: boolean
    description: string
    handlePress: () => void
  }) => {
    return (
      <Pressable
        backgroundColor={p.send ? '#F1FDEB' : '#FEF9F1'}
        borderRadius="8px"
        borderColor={p.send ? '#387E1B' : '#DC9101'}
        width="48%"
        px="16px"
        py="12px"
        onPress={p.handlePress}
        borderWidth="1px">
        <HStack justifyContent="space-between">
          <Heading
            fontSize="16px"
            lineHeight="26px"
            color={p.send ? '#387E1B' : '#DC9101'}>
            {p.title}
          </Heading>
          <ChevIcon color={p.send ? '#387E1B' : '#DC9101'} />
        </HStack>
        <Text fontSize="12px">{p?.description}</Text>
        {/* <Box bottom={-10} right={-10}>
          <SendIcon2 />
        </Box> */}
      </Pressable>
    )
  }

  // return (
  //   <HStack justifyContent="space-between" textAlign="center">
  //     <ActionItem
  //       send
  //       title="Send money"
  //       handlePress={() => navigation.navigate(WalletRoutes.SendMoney)}
  //       description="Transfer to a Bank, Mobile or to another wallet user"
  //     />
  //     <ActionItem
  //       title="Withdraw"
  //       handlePress={() => setModalOpen(true)}
  //       description="Withdraw to linked account"
  //     />
  //     <WithdrawToLinkedModal
  //       hideModal={() => setModalOpen(false)}
  //       isOpen={modalOpen}
  //     />
  //   </HStack>
  // )

  //Below code was left here intentionally
  return (
    <>
      <HStack
        justifyContent="space-between"
        paddingY="22px"
        textAlign="center"
        // px="16px"
        mt="24px">
        {walletItems.map((item, index) => {
          return (
            <QuickItem
              item={item}
              Icon={item.Icon}
              label={item.label}
              onPress={() => handleNavigate(item)}
              key={index}
            />
          )
        })}
      </HStack>
      <WithdrawToLinkedModal
        hideModal={() => setModalOpen(false)}
        isOpen={modalOpen}
      />
    </>
  )
}

export default WalletQuickItems
