import React from 'react'
import { Box } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import LeaveForm from './containers/LeaveForm'
import { useTranslation } from 'react-i18next'

const RequestLeave = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation('leaves')
  return (
    <Box safeArea flex={1} backgroundColor="white" px="16px">
      <ScreenHeader
        title={t('ApplyLeave')}
        onPress={() => navigation.goBack()}
        close
      />
      <LeaveForm navigation={navigation} />
    </Box>
  )
}

export default RequestLeave
