import React, { useState } from 'react'
import ScreenContainer from '~components/ScreenContainer'
import ScreenHeader from '~components/ScreenHeader'
import { Box, Divider, Pressable, Text } from 'native-base'
import WalletListBox from '../../components/WalletListBox'
import QIcon from '~assets/svg/question.svg'
import SMSIcon from '~assets/svg/sms-verifcation.svg'
import ChevIcon from '~assets/svg/chev-right.svg'
import { Switch } from 'native-base'
import { noop } from 'lodash'
import SMSModal from './modals/SmsModal'
import { SvgProps } from 'react-native-svg'
import {
  useGetNotificationSettings,
  useGetWalletUser,
  useSend2FactorAuthOTP,
} from '~api/wallet'
import LoadingModal from '~components/modals/LoadingModal'
import SecurityQuestionsModal from './modals/SecurityQuestionModal'

type Setting = {
  name: string
  value: string
  uuid: string
}

const WalletTwaFa = ({ navigation }) => {
  const [smsModalOpen, setSmsModalOpen] = useState(false)
  const [securityQuestionsModalOpen, setSecurityQuestionsModalOpen] =
    useState(false)

  const { data } = useGetWalletUser()
  const user_uuid = data?.data?.uuid
  const { data: settings, isLoading: isLoadingSettings } =
    useGetNotificationSettings(user_uuid)

  console.log('settings', settings)

  const is2FAEnabled =
    settings?.data?.find(
      (setting: Setting) => setting.name === 'two_factor_auth_enabled',
    )?.value == '1'
  const isSMSVerificationEnabled =
    settings?.data?.find(
      (setting: Setting) => setting.name === 'two_factor_auth_sms',
    )?.value == '1'

  const isSecurityQuestionsEnabled =
    settings?.data?.find(
      (setting: Setting) =>
        setting.name === 'two_factor_auth_method_security_question',
    )?.value == '1'

  const { mutate, isLoading } = useSend2FactorAuthOTP()

  const handleSmSVerification = () => {
    mutate(
      { user_uuid: data?.data?.uuid },
      {
        onSuccess: () => {
          setSmsModalOpen(true)
        },
      },
    )
  }

  const handleSwitch = (type: 'sms' | 'security') => {
    if (type === 'sms') {
      handleSmSVerification()
    } else {
      setSecurityQuestionsModalOpen(true)
    }
  }

  const TwoFAItem = ({
    title,
    description,
    Icon,
    checked,
    onPress,
  }: {
    title: string
    description: string
    Icon: React.FC<SvgProps>
    checked: boolean
    onPress: () => void
  }) => (
    <Pressable flexDirection="row" alignItems="center" padding="16px">
      <Icon />
      <Box mr="auto" ml="8px">
        <Text
          fontFamily="title"
          color="charcoal"
          fontSize="16px"
          lineHeight="24px"
          mb={'3px'}>
          {title}
        </Text>
        <Text fontSize="14px" lineHeight="22px" mt="3px">
          {description}
        </Text>
      </Box>

      <Switch isChecked={checked} onToggle={onPress} />
    </Pressable>
  )
  return (
    <ScreenContainer>
      <ScreenHeader
        title="Two-Factor Authentication"
        onPress={() => navigation.goBack()}
      />
      <Box mt="32px">
        <Text
          fontFamily="title"
          fontSize="16px"
          lineHeight="24px"
          color="charcoal">
          Choose your preferred validation method
        </Text>
        <Box mt="16px" />
        <WalletListBox>
          <TwoFAItem
            Icon={SMSIcon}
            title="SMS verification"
            description="Receive a verification code via sms"
            checked={isSMSVerificationEnabled}
            onPress={() => handleSwitch('sms')}
          />
          {/* <Divider my="2px" />
          <TwoFAItem
            Icon={QIcon}
            title="Security Questions"
            description="Answer a security question"
            checked={isSecurityQuestionsEnabled}
            onPress={() => handleSwitch('security')}
          /> */}
        </WalletListBox>
      </Box>
      <SMSModal
        isOpen={smsModalOpen}
        hideModal={() => setSmsModalOpen(false)}
        isSMSVerificationEnabled={isSMSVerificationEnabled}
      />
      <SecurityQuestionsModal
        isOpen={securityQuestionsModalOpen}
        hideModal={() => setSecurityQuestionsModalOpen(false)}
        isSecurityQuestionsEnabled={isSecurityQuestionsEnabled}
      />
      <LoadingModal message="Sending OTP" isVisible={isLoading} />
    </ScreenContainer>
  )
}

export default WalletTwaFa
