import React from 'react'
import { Box, Text, Button } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { AppModules, ExpenseRoutesRedesign, MainStackUseNavigationProp } from '~types'
import EmptyStateDynamic from '~components/empty-state/EmptyStateDynamic'
import ExpenseIcon from '~assets/svg/expenses.svg'

type NoExpenseProps = {
  expenseCategory?: string
}

const NoExpense = ({ expenseCategory }: NoExpenseProps) => {
  const navigation = useNavigation<MainStackUseNavigationProp>()
  return (
    <Box flex={1} backgroundColor="white">
      <Box flex={1} alignItems="center" justifyContent="center">
        <EmptyStateDynamic
          moduleName={AppModules.expenses}
          title={`You have no ${expenseCategory?.toLowerCase()} expenses yet`}
          subTitle="Record a new expense by clicking the button below"
          Icon={ExpenseIcon}
        />
      </Box>

    </Box>
  )
}

export default NoExpense
