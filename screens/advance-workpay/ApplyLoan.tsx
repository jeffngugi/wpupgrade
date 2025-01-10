import React from 'react'
import { Box } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import _ from 'lodash'
import AdvanceLoanForm from './containers/AdvanceLoanForm'

const ApplyLoan = ({ navigation }) => {
  return (
    <Box flex={1} safeArea backgroundColor="white" paddingX="16px">
      <ScreenHeader
        title="Apply for advance"
        onPress={() => navigation.goBack()}
        close
      />
      <AdvanceLoanForm navigation={navigation} />
    </Box>
  )
}

export default ApplyLoan
