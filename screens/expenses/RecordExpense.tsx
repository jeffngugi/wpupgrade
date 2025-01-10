import { Box } from 'native-base'
import React from 'react'

import ScreenHeader from '~components/ScreenHeader'

import ExpenseForm from './containers/ExpenseForm'
import { NavigationProp } from '@react-navigation/native'

type RecordExpenseProps = {
  navigation: NavigationProp<any>
}

const RecordExpense = ({ navigation }: RecordExpenseProps) => {
  return (
    <Box flex={1} safeArea backgroundColor="white" paddingX="16px">
      <ScreenHeader
        title="New Expense"
        onPress={() => navigation.goBack()}
        close
      />

      <ExpenseForm />
    </Box>
  )
}

export default RecordExpense
