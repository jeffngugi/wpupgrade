import { useNavigation } from '@react-navigation/native'
import { Box, Pressable, Text } from 'native-base'
import React from 'react'
import NewBadge from './NewBadge'
import NotifBadge from './NotifBadge'
import _, { noop } from 'lodash'
import { windowWidth } from '~utils/appConstants'
import { MenuItemType } from '~declarations'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'

const GridCard = ({
  item,
}: {
  item: MenuItemType
  index: number
  length?: number
  itemNumber?: number
}) => {
  const { Icon, name, route } = item
  const navigation = useNavigation()
  const showNotif = false

  return (
    <Pressable
      borderWidth={'1px'}
      borderColor="navy.10"
      alignItems="center"
      justifyContent={'center'}
      borderRadius="4px"
      fontSize="16px"
      height={'130px'}
      paddingY={'auto'}
      marginTop="7px"
      marginBottom="22px"
      width={windowWidth * 0.27}
      _pressed={{
        backgroundColor: '#F1FDEB',
      }}
      onPress={() => {
        item.route ? navigation.navigate(route) : noop
        analyticsTrackEvent(AnalyticsEvents.MenuEvents.select_menu_item, {
          name: name,
        })
      }}>
      <Icon width={56} height={56} />
      <Text
        fontFamily="body"
        textAlign="center"
        color={'charcoal'}
        marginTop="12px"
        fontSize={'16px'}>
        {name}
      </Text>
      {showNotif ? <NotifBadge gridView /> : null}
      {item?.new ? (
        <Box position="absolute" right="-7px" top="-6px">
          <NewBadge />
        </Box>
      ) : null}
    </Pressable>
  )
}

export default GridCard
