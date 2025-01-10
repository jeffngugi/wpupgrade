import React from 'react'
import { Box, HStack, Text, Pressable, FlatList } from 'native-base'
import XIcon from '~assets/svg/wallet-x.svg'
import BankIcon from '~assets/svg/wallet-bank.svg'
import MobileIcon from '~assets/svg/mobile.svg'
import ChevIcon from '~assets/svg/chev-r.svg'
import { useGetLinkedAccounts } from '~api/wallet'
import { TLinkedAccount, WalletRoutes } from '~types'
import { windowHeight } from '~utils/appConstants'
import { ListRenderItem } from 'react-native'
import ActionSheetModal from '~components/modals/ActionSheetModal'
import PlusIcon from '~assets/svg/plus.svg'
import { useNavigation } from '@react-navigation/native'

type Props = {
  isOpen: boolean
  hideModal: () => void
}

const WithdrawToLinkedModal = (p: Props) => {
  const { data, isLoading } = useGetLinkedAccounts()
  const navigation = useNavigation()

  const handleLinkAccount = () => {
    p.hideModal()
    navigation.navigate(WalletRoutes.LinkAccount)
  }

  const hasBank = data?.data.find(data => data?.channel === 'BANK_TRANSFER')
  const hasMobile = data?.data.find(data => data?.channel !== 'BANK_TRANSFER')

  const renderItem: ListRenderItem<TLinkedAccount> = ({ item }) => {
    const handlePress = () => {
      p.hideModal()
      navigation.navigate(WalletRoutes.WithdrawMoneyAmountForm, { item })
    }

    return <LinkedAccountCard item={item} handlePress={handlePress} />
  }

  const LinkedAccountCard = ({
    item,
    handlePress,
  }: {
    item: TLinkedAccount
    handlePress: () => void
  }) => {
    const name = item?.acc_name ?? '-'
    const providerName = item?.bank?.name ?? 'Mobile account'
    const providerType = item?.bank?.name ? 'Bank' : 'Mpesa'
    const accNo = item?.acc_no ?? ''
    const provider_accNo = `${providerType} ${accNo}`

    return (
      <Pressable
        borderWidth={1}
        borderRadius="8px"
        backgroundColor={'#F1FDEB' ?? 'white'}
        borderColor={'green.50' ?? '#E4E5E7'}
        paddingX="16px"
        paddingY="12px"
        alignItems="center"
        flexDirection="row"
        onPress={handlePress}>
        {item.channel === 'MPESA' ? (
          <MobileIcon color={'#253545'} />
        ) : (
          <BankIcon color="#253545" />
        )}

        <Box marginLeft="20px" marginRight="auto">
          <Text fontFamily="heading" lineHeight="26px" fontSize="16px">
            {providerName}
          </Text>
          <Text my="4px">{provider_accNo}</Text>
          <Text>{name}</Text>
        </Box>
        <Box>
          <ChevIcon width={30} height={30} color="#253545" />
        </Box>
      </Pressable>
    )
  }

  const ListFooter = () => (
    <Pressable
      my={'10px'}
      borderWidth={1}
      borderRadius="8px"
      backgroundColor={'#F1FDEB' ?? 'white'}
      borderColor={'green.50' ?? '#E4E5E7'}
      paddingX="16px"
      paddingY="12px"
      alignItems="center"
      flexDirection="row"
      onPress={handleLinkAccount}>
      <PlusIcon color="#253545" />
      <Text fontFamily="heading" lineHeight="26px" fontSize="16px" ml="20px">
        Link an account
      </Text>
    </Pressable>
  )
  return (
    <ActionSheetModal
      isOpen={p.isOpen}
      onHide={p.hideModal}
      onBackdropPress={p.hideModal}>
      <Box px="16px" flex={1} top="-20" pb="30px" height={windowHeight * 0.6}>
        <HStack mb="20px" alignItems="center" justifyContent="space-between">
          <Text color="charcoal" fontSize="20px" lineHeight="30px">
            Withdraw to linked account
          </Text>
          <Pressable onPress={p.hideModal}>
            <XIcon color="#253545" />
          </Pressable>
        </HStack>
        <FlatList
          data={data?.data ?? []}
          renderItem={renderItem}
          height={windowHeight * 0.7}
          ItemSeparatorComponent={() => <Box padding="5px" />}
          ListFooterComponent={!!hasBank && !!hasMobile ? null : ListFooter}
        />
      </Box>
    </ActionSheetModal>
  )
}

export default WithdrawToLinkedModal
