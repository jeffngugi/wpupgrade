import React from 'react'
import { Box, Divider, HStack, Pressable, Text, useToast } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import SupportImg from '~assets/svg/support-img.svg'
import PhoneIcon from '~assets/svg/phone.svg'
import MailIcon from '~assets/svg/mail.svg'
import { SvgProps } from 'react-native-svg'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import { useFetchProfile } from '~api/home'
import { capitalize, isString } from 'lodash'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import Clipboard from '@react-native-clipboard/clipboard'
import { openDialPad } from '~utils/app-utils'

export type TsupportItem = {
  label: string
  value: string
  Icon: React.FC<SvgProps>
  onPress: () => unknown
}

export const callSupport = (phone: string) => {
  analyticsTrackEvent(AnalyticsEvents.Accounts.call_support, {})
  openDialPad(phone)
}

const SupportScreen = ({ navigation }) => {
  useStatusBarBackgroundColor('white')
  const toast = useToast()

  const emailSupport = (email: string) => {
    Clipboard.setString(email)
    toast.show({ description: 'Support email copied' })
    analyticsTrackEvent(AnalyticsEvents.Accounts.email_support, {})
  }
  const { data } = useFetchProfile()
  const firstName = isString(data?.data?.name)
    ? data?.data?.name.split(' ')[0]
    : ''

  const phone =
    data?.data?.country_code === 'NG' ? '+2349063829334' : '+254711082123'

  const supportItems: TsupportItem[] = [
    {
      label: 'Phone Number',
      value: phone,
      Icon: PhoneIcon,
      onPress: () => callSupport(phone),
    },
    {
      label: 'Email address',
      value: 'support@myworkpay.com',
      Icon: MailIcon,
      onPress: () => emailSupport('support@myworkpay.com'),
    },
  ]

  const SupportCard = ({ item }: { item: TsupportItem }) => {
    const { value, label, Icon, onPress } = item
    return (
      <Box pt="16px">
        <Text fontSize={'14px'} color={'grey'}>
          {label}
        </Text>
        <HStack justifyContent="space-between" mb="16px" mt={'8px'}>
          <Text fontSize={'16px'} color={'charcoal'}>
            {value}
          </Text>
          <Pressable onPress={onPress}>
            <Icon color="#62A446" />
          </Pressable>
        </HStack>
        <Divider />
      </Box>
    )
  }

  return (
    <Box flex={1} safeArea px="16px" bgColor="white">
      <ScreenHeader onPress={() => navigation.goBack()} title="Support" />
      <Box mt="40px" mb="24px" alignItems="center">
        <SupportImg />
      </Box>
      <Text color="charcoal" textAlign="center" fontSize="16px">
        Hello {capitalize(firstName)}, you can reach us via our phone number or
        email address.
      </Text>
      <Box height={'65px'} />
      {supportItems.map((item, index) => (
        <SupportCard key={index.toString()} item={item} />
      ))}
    </Box>
  )
}

export default SupportScreen
