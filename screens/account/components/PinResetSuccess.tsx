import React from 'react'
import PinIcon from '~assets/svg/pin-success.svg'
import { Box, Text, Button } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import SubmitButton from '~components/buttons/SubmitButton'

const PinResetSuccess = () => {
  const { t } = useTranslation('lockscreen')
  const navigation = useNavigation()
  return (
    <Box flex={1} px="16px">
      <Box
        alignItems="center"
        justifyContent="center"
        backgroundColor="transparent"
        textAlign="center"
        marginX="50px"
        flex={1}>
        <Box marginY="10px">
          <PinIcon width={140} height={140} />
        </Box>
        <Text
          fontFamily="heading"
          fontSize="20px"
          color="charcoal"
          textAlign="center">
          {t('pinResetTitle')}
        </Text>
        {/* <Text
          textAlign="center"
          marginY="6px"
          fontSize={'16px'}
          color={'charcoal'}>
          {t('pinResetSubTitle')}
        </Text> */}
      </Box>

      <SubmitButton
        onPress={() =>
          navigation.navigate('HomeTabNavigator', { screen: 'Home' })
        }
        title={t('Done')}></SubmitButton>
    </Box>
  )
}

export default PinResetSuccess
