import { SectionListRenderItem, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ScreenContainer from '~components/ScreenContainer'
import ScreenHeader from '~components/ScreenHeader'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  NotificationSectionItemType,
  NotificationSectionTypes,
  WalletRoutes,
} from '~types'
import { ScrollView, SectionList } from 'native-base'
import NotificationListItem from './components/NotificationListItem'
import { notificationData } from './data/notificationData'
import ItemDivider from '~screens/account/components/ItemDivider'
import ItemsHead from './components/ItemsHead'
import NotificationModal from './components/NotificationModal'
import { useGetNotificationSettings, useGetWalletUser } from '~api/wallet'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.Notifications>
  route: MainNavigationRouteProp<WalletRoutes.Notifications>
}

interface SettingItem {
  name: string
  value: string
  uuid: string
}

const WalletNotifications = ({ navigation }: Props) => {
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [notificationItem, setNotificationItem] =
    useState<NotificationSectionItemType>()
  const { data } = useGetWalletUser()
  const user_uuid = data?.data?.uuid

  const { data: settings, isLoading: isLoadingSettings } =
    useGetNotificationSettings(user_uuid)

  const notificationDataWithSetting = notificationData.map(
    (section: NotificationSectionTypes) => {
      const newSection = { ...section }
      newSection.data = section?.data?.map(item => {
        const newItem = { ...item }
        const setting = settings?.data?.find(
          (setting: SettingItem) => setting.name === item.id,
        )
        newItem.setting = setting
        return newItem
      })
      return newSection
    },
  )

  const renderItem: SectionListRenderItem<
    NotificationSectionItemType,
    NotificationSectionTypes
  > = ({ item }) => {
    const handlePress = () => {
      setShowNotificationModal(true)
      setNotificationItem(item)
    }

    return (
      <NotificationListItem
        handlePress={handlePress}
        item={item}
        settings={settings?.data}
      />
    )
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Notifications" onPress={() => navigation.goBack()} />
      <ScrollView flex={1} mt={'20px'}>
        <SectionList
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          sections={notificationDataWithSetting}
          ItemSeparatorComponent={ItemDivider}
          keyExtractor={(index, item) => index.toString() + item}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title, description } }) => (
            <ItemsHead title={title} description={description} />
          )}
          renderSectionFooter={ItemDivider}
        />
      </ScrollView>
      <NotificationModal
        isOpen={showNotificationModal}
        hideModal={() => setShowNotificationModal(false)}
        item={notificationItem}
      />
    </ScreenContainer>
  )
}

export default WalletNotifications

const styles = StyleSheet.create({})
