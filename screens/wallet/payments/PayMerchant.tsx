import { ListRenderItem } from 'react-native'
import React from 'react'
import { Divider, FlatList } from 'native-base'
import ScreenContainer from '~components/ScreenContainer'
import WalletHomeHeader from '../home/components/WalletHomeHeader'
import XIcon from '~assets/svg/wallet-x.svg'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  WalletRoutes,
} from '~types'
import WalletListBox from '../components/WalletListBox'
import { useWalletSendTo, PayToType } from '../data/useWalletData'
import WalletListItem from '../components/WalletListItem'
const { payMerchantData } = useWalletSendTo()

interface Props {
  navigation: MainNavigationProp<WalletRoutes.Merchant>
  route: MainNavigationRouteProp<WalletRoutes.Merchant>
}

const PayMerchant = ({ navigation }: Props) => {
  const renderItem: ListRenderItem<PayToType> = ({ item }) => {
    const { Icon, source } = item
    const handlePress = () => {
      navigation.navigate(WalletRoutes.MerchantForm, {
        merchantType: item.merchantType,
      })
    }
    return <WalletListItem onPress={handlePress} Icon={Icon} source={source} />
  }
  return (
    <ScreenContainer>
      <WalletHomeHeader
        title="Pay merchants"
        subTitle="Simplify. Organize. Pay merchants effortlessly."
        Icon={XIcon}
        onPress={() => navigation.goBack()}
      />

      <WalletListBox mt="32px">
        <FlatList
          data={payMerchantData}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider borderColor="red.200" />}
        />
      </WalletListBox>
    </ScreenContainer>
  )
}

export default PayMerchant
