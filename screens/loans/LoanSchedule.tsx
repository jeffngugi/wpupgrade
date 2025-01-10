import { Box, Divider, FlatList } from 'native-base'
import React from 'react'
import ScreenHeader from '~components/ScreenHeader'
import ScheduleItem from './components/ScheduleItem'
import { useRoute } from '@react-navigation/native'

const LoanSchedule = ({ navigation }) => {
  const route = useRoute()
  const { loanSchedule } = route.params

  const renderItem = ({ item }) => <ScheduleItem item={item} />
  return (
    <Box flex={1} safeArea backgroundColor="white">
      <Box marginX="16px" marginBottom={'24px'}>
        <ScreenHeader
          title="Loan Amortization schedule"
          onPress={() => navigation.goBack()}
        />
      </Box>
      <Divider height="5px" backgroundColor="#F3F3F3" />
      <FlatList data={loanSchedule} renderItem={renderItem} />
    </Box>
  )
}

export default LoanSchedule
