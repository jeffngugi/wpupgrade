import React from 'react'
import { Box, FlatList } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import { ListRenderItem } from 'react-native'
import { AccountSectionItemType } from '~types'
import { walletSettingData } from '~screens/account/accountsDatas'
import AccountListItem from '~screens/account/components/AccountListItem'
import ItemDivider from '~screens/account/components/ItemDivider'
import { useDisableWalletPayment, useEnableWalletPayment } from '~api/wallet'
import { useEMployeeDetails } from './hooks/useEmployeeDetails'
import { useMyProfile } from '~api/account'
import LoadingModal from '~components/modals/LoadingModal'

const WalletSetting = ({ navigation }) => {
  const { data: employeeDetails } = useMyProfile()
  const isWalletEnabled =
    employeeDetails?.data?.bank_details?.payment_method === 'WALLET'

  const { mutate: enableWalletPayment, isLoading: isEnableLoading } =
    useEnableWalletPayment()
  const { mutate: disableWalletPayment, isLoading: isDisableLoading } =
    useDisableWalletPayment()

  const handleSwitchWalletPayment = () => {
    if (!isWalletEnabled) {
      enableWalletPayment()
    } else {
      disableWalletPayment()
    }
  }

  const renderItem: ListRenderItem<AccountSectionItemType> = ({ item }) => {
    const handlePress = () => {
      if (item.route) {
        // eslint-disable-next-line react/prop-types
        navigation.navigate(item.route)
      }
    }

    return (
      <AccountListItem
        handlePress={handlePress}
        item={item}
        handleSwitch={handleSwitchWalletPayment}
        switchEnabled={isWalletEnabled}
      />
    )
  }

  return (
    <Box safeArea px="16px" backgroundColor="white" flex={1}>
      <ScreenHeader
        title="Wallet Settings"
        onPress={() => navigation.goBack()}
      />
      <FlatList
        mt="20px"
        flex={1}
        renderItem={renderItem}
        data={walletSettingData}
        ItemSeparatorComponent={ItemDivider}
      />
      <LoadingModal
        isVisible={isEnableLoading || isDisableLoading}
        text="Updating wallet payment method"
      />
    </Box>
  )
}

export default WalletSetting
