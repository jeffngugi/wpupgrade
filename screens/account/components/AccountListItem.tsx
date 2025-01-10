import React from 'react'
import { Pressable, Box, Text, Switch } from 'native-base'
import { AccountSectionItemType } from '~types'
import { getVersion, getBuildNumber } from 'react-native-device-info'
import CheVRight from '~assets/svg/chev-right.svg'

type Props = {
  item: AccountSectionItemType
  handlePress: () => void
  handleSwitch?: () => void
  switchEnabled?: boolean
}
const AccountListItem = ({
  item,
  handlePress,
  handleSwitch,
  switchEnabled,
}: Props) => {
  const { Icon } = item
  const version = getVersion()
  const buildNumber = getBuildNumber()

  return (
    <Pressable
      flexDirection="row"
      paddingX="16px"
      alignItems="center"
      paddingY="20px"
      disabled={item?.label === 'Touch ID Login'}
      onPress={handlePress}>
      {item.label === 'Version' ? (
        <Box width={'100%'} alignItems={'center'}>
          <Text fontSize="16px" color="charcoal">
            Workpay App Version {version}({buildNumber})
          </Text>
        </Box>
      ) : (
        <>
          <Box>
            <Icon color={item?.id === 'optOut' ? '#F14B3B' : '#536171'} />
          </Box>
          <Box marginLeft="20px" mr={'auto'} width={'70%'}>
            <Text
              fontSize="16px"
              color={item?.id === 'optOut' ? '#F14B3B' : 'charcoal'}>
              {item?.label}
            </Text>
          </Box>
          {item?.label === 'Touch ID Login' ||
          item?.label === 'Face ID Login' ||
          item?.label === 'Receive your salary to your wallet' ? (
            <Switch
              disabled={
                item?.label == 'Receive your salary to your wallet' &&
                switchEnabled
              }
              onToggle={handleSwitch}
              isChecked={switchEnabled}
            />
          ) : (
            <CheVRight color="#62A446" />
          )}
        </>
      )}
    </Pressable>
  )
}

export default AccountListItem
