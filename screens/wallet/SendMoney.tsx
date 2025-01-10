import React from 'react'
import ScreenContainer from '~components/ScreenContainer'
import { FlatList, Divider } from 'native-base'
import WalletHomeHeader from './home/components/WalletHomeHeader'
import XIcon from '~assets/svg/wallet-x.svg'
import WalletListBox from './components/WalletListBox'
import { ListRenderItem } from 'react-native'
import { SendToType, useWalletSendTo } from './data/useWalletData'
import WalletListItem from './components/WalletListItem'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  WalletRoutes,
} from '~types'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.SendMoney>
  route: MainNavigationRouteProp<WalletRoutes.Merchant>
}

const SendMoney = ({ navigation }: Props) => {
  const { sendToData } = useWalletSendTo()
  const renderItem: ListRenderItem<SendToType> = ({ item, indx }) => {
    const { Icon, source, description, route } = item

    const handlePress = () => {
      if (route) {
        navigation.navigate(route)
      }
    }
    return (
      <WalletListItem
        onPress={handlePress}
        Icon={Icon}
        source={source}
        description={description}
      />
    )
  }
  return (
    <ScreenContainer>
      <WalletHomeHeader
        title={'Send Money'}
        subTitle="Transfer funds out of your wallet"
        Icon={XIcon}
        onPress={() => navigation.goBack()}
      />
      <WalletListBox mt="32px">
        <FlatList
          data={sendToData}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider borderColor="red.200" />}
        />
      </WalletListBox>
    </ScreenContainer>
  )
}

export default SendMoney
