import React, { useEffect } from 'react'
import { Pressable, Box, Text, Switch } from 'native-base'
import { NotificationSectionItemType } from '~types'
import { noop } from 'lodash'
import {
  useGetWalletUser,
  useUpdateNotificationSettingsMutation,
} from '~api/wallet'
import { walletQKeys } from '~api/QueryKeys'
import { useQueryClient } from '@tanstack/react-query'
import LoadingModal from '~components/modals/LoadingModal'

type Setting = {
  name: string
  value: string
}

type Props = {
  item: NotificationSectionItemType
  handlePress: () => void
  settings: Setting[]
}
const NotificationListItem = ({ item, handlePress, settings }: Props) => {
  const queryClient = useQueryClient()
  const settingValue = settings?.find(
    (setting: any) => setting.name === item.name,
  )
  const [switchChecked, setSwitchChecked] = React.useState(
    settingValue?.value === '1',
  )
  const { data } = useGetWalletUser()
  const user_uuid = data?.data?.uuid
  const { mutate, isLoading } = useUpdateNotificationSettingsMutation()

  const handleSwitch = () => {
    if (!switchChecked && item.name != 'bill_payment_alert') {
      handlePress()
    } else {
      const payload = {
        user_uuid,
        settings: [
          {
            name: item.name,
            value: switchChecked ? '0' : '1',
          },
        ],
      }

      mutate(payload, {
        onSuccess: () => {
          setSwitchChecked(!switchChecked)
          queryClient.invalidateQueries(walletQKeys.notificationSettings)
        },
      })
    }
  }

  const settingLimit = settings?.find(
    (setting: any) => setting.name === item.limitName,
  )

  useEffect(() => {
    if (settingValue?.value === '1' && !isLoading) {
      setSwitchChecked(true)
    } else {
      setSwitchChecked(false)
    }
  }, [settingValue, isLoading])

  return (
    <Pressable
      flexDirection="row"
      alignItems="center"
      paddingY="20px"
      disabled={item?.label === 'Touch ID Login'}
      onPress={noop}>
      <>
        <Box marginLeft="20px" mr={'auto'}>
          <Text
            fontSize="16px"
            color={item?.id === 'optOut' ? '#F14B3B' : 'charcoal'}>
            {item?.label}
          </Text>
          <Text fontSize="14px" marginTop="2px" color={'grey'}>
            {item?.name != 'bill_payment_alert'
              ? item?.isEditable
                ? settingValue?.value
                : `Send when limit exceeds ${settingLimit?.value}`
              : null}
          </Text>
        </Box>
        {item?.isEditable ? (
          <Pressable
            flexDirection="row"
            alignItems="center"
            backgroundColor="green.10"
            paddingY="4px"
            paddingX="8px"
            borderRadius="4px"
            onPress={handlePress}>
            <Text
              marginLeft="8px"
              color="green.50"
              fontFamily={'heading'}
              fontSize={'16px'}>
              {'Edit'}
            </Text>
          </Pressable>
        ) : (
          <Switch onChange={handleSwitch} isChecked={switchChecked} />
        )}
      </>
      <LoadingModal
        message="Updating Notification Settings"
        isVisible={isLoading}
      />
    </Pressable>
  )
}

export default NotificationListItem
