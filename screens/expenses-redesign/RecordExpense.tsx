import { Box } from 'native-base'
import React, { useState } from 'react'

import ScreenHeader from '~components/ScreenHeader'

import ExpenseForm from './containers/ExpenseForm'
import { NavigationProp } from '@react-navigation/native'

type RecordExpenseProps = {
  navigation: NavigationProp<any>
}
export const STAGES = {
  1: '1',
  2: '2'
}

const RecordExpense = ({ route, navigation }: RecordExpenseProps) => {
  const { isImprest } = route.params
  const [currentStage, setCurrentStage] = useState<typeof STAGES[keyof typeof STAGES]>(STAGES[1])

  return (
    <Box flex={1} safeArea backgroundColor="white" paddingX="16px">
      <ScreenHeader
        title="New Expense"
        onPress={() => {
          if (currentStage === STAGES[1]) {
            navigation.goBack()
          } else {
            setCurrentStage(STAGES[1])
          }
        }
        }
        close
      />

      <ExpenseForm isImprest={isImprest}
        currentStage={currentStage}
        setCurrentStage={setCurrentStage}
      />
    </Box>
  )
}

export default RecordExpense
