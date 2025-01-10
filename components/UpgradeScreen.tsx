import React from 'react'
import ScreenContainer from './ScreenContainer'
import UpgradeIcon from '~assets/svg/upgrade.svg'
import { Text, Box } from 'native-base'
import { useTranslation } from 'react-i18next'
import { openStorePage } from '~utils/linking'
import SubmitButton from './buttons/SubmitButton'

const UpgradeScreen = () => {
  const { t } = useTranslation('upgrade')
  return (
    <ScreenContainer>
      <Box flex={1} alignItems="center" textAlign="center">
        <UpgradeIcon />
        <Text mt="32px" color="charcoal" fontSize="16px">
          {t('title')}
        </Text>
        <Text textAlign="center">{t('subTitle')}</Text>
      </Box>
      <SubmitButton onPress={openStorePage} title={t('btnTxt')} />
    </ScreenContainer>
  )
}

export default UpgradeScreen
