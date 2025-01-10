import React from 'react'
import { Box, ScrollView, Text } from 'native-base'
import CommonInput from '~components/inputs/CommonInput'
import { useTranslation } from 'react-i18next'
import { EwaFormProps } from './EwaMpesa'
import UserAvatar from '~components/UserAvatar'
import { getFirstCharacters } from '~utils/appUtils'
import { useWalletStatus } from '~screens/wallet/hooks/useWalletStatus'

const EWAWallet = (p: EwaFormProps) => {
  const { t } = useTranslation('ewa')

  const { wallet_account, data } = useWalletStatus()
  const profile = data?.data?.profile
  const user = `${profile?.first_name} ${profile?.last_name}`
  const avatarFall = getFirstCharacters(user ?? 'W P')

  return (
    <ScrollView flex={1}>
      <Box alignItems="center" mt="32px" textAlign="center">
        <UserAvatar fallback={avatarFall} width="64px" />
        <Text
          fontFamily="heading"
          fontSize="18px"
          color="charcoal"
          lineHeight="30px">
          {user}
        </Text>
        <Text fontFamily="heading" fontSize="16px" lineHeight="24px" mb="8px">
          {wallet_account?.acc_no}
        </Text>
      </Box>
      <CommonInput
        label={t('enterAmount')}
        name="amount"
        control={p.control}
        keyboardType="phone-pad"
        rules={{
          required: { value: true, message: t('amountRequired') },
        }}
      />
    </ScrollView>
  )
}

export default EWAWallet
