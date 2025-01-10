import React from 'react'
import { HStack, Box, Text, Pressable, Divider, View } from 'native-base'
import NewBadge from './NewBadge'
import NotifBadge from './NotifBadge'
import { useNavigation } from '@react-navigation/native'
import { noop } from 'lodash'
import { MenuItemType } from '~declarations'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'

const ListCard = ({ item }: { item: MenuItemType }) => {
  const { Icon, name, description, route } = item
  const navigation = useNavigation()
  const showNotif = false

  return (
    <Pressable
      _pressed={{
        backgroundColor: 'green.10',
      }}
      paddingX="16px"
      onPress={() => {
        item.route ? navigation.navigate(route) : noop
        analyticsTrackEvent(AnalyticsEvents.MenuEvents.select_menu_item, {
          name: item?.name ?? '',
        })
      }}>
      <HStack width={'100%'} marginY={'15px'}>
        <Box marginRight="16px" alignContent={'center'}>
          <View my={'auto'}>
            <Icon width={'48px'} height={'48px'} />
          </View>
          {showNotif ? <NotifBadge /> : false}
        </Box>
        <Box maxWidth={'80%'}>
          <HStack alignItems="center">
            <Text color="charcoal" fontSize="18px" fontFamily={'heading'}>
              {name}
            </Text>
            <Box marginLeft="6px">{item?.new ? <NewBadge /> : null}</Box>
          </HStack>
          <Text fontSize="14px" fontFamily={'body'} color="grey">
            {description}
          </Text>
        </Box>
      </HStack>
      <Divider
        _light={{
          bg: '#F0F4F9',
        }}
      />
    </Pressable>
  )
}

export default ListCard
