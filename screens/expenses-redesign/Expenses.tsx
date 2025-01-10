import React from 'react'
import { Box } from 'native-base'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ScreenHeader from '~components/ScreenHeader'
import { ExpenseRoutes, ExpenseRoutesRedesign } from '~types'
import ExpensesTab from './ExpensesTab'
import { EXPENSE_STATUSES } from './constants'
import { tabBarScreenOptionsPills } from '~theme/components/tabBarStyles'
import { useExpenseCategoriesFetchQuery } from '~api/expenses'
import { NavigationProp } from '@react-navigation/native'
import { ExpenseRouteInitialParams } from './types'
import SubmitButton from '~components/buttons/SubmitButton'
import { CustomTabBarLabel } from '~components/tabs/TabsComponents'

type ExpensesProps = {
  navigation: NavigationProp<any>;
};

const Expenses: React.FC<ExpensesProps> = ({ navigation }) => {
  const Tab = createMaterialTopTabNavigator()
  useExpenseCategoriesFetchQuery({ searchText: '' })

  return (
    <Box safeArea flex={1} backgroundColor="white" px="16px">
      <ScreenHeader onPress={() => navigation.goBack()} title="Expenses" />
      <Box mt={'24px'}></Box>
      <Tab.Navigator screenOptions={tabBarScreenOptionsPills}>
        <Tab.Screen
          name={ExpenseRoutes.All}
          initialParams={{
            expenseStatus: {},
            expenseCategory: '',
          } as ExpenseRouteInitialParams}
          component={ExpensesTab}
          // options={{ tabBarLabel: 'All' }}
          options={{
            tabBarLabel: ({ focused }) => (
              <CustomTabBarLabel focused={focused} label="All" />
            ),
          }}
        />
        <Tab.Screen
          name={ExpenseRoutes.Pending}
          initialParams={{
            expenseStatus: { status: EXPENSE_STATUSES.NOTPAID, submitted: 1 },
            expenseCategory: 'Pending',
          }}
          component={ExpensesTab}
          options={{
            tabBarLabel: ({ focused }) => (
              <CustomTabBarLabel focused={focused} label="Pending" />
            ),
          }}
        />
        <Tab.Screen
          name={ExpenseRoutes.Approved}
          initialParams={{
            expenseStatus: { status: EXPENSE_STATUSES.NOTPAID, is_approved: 1 },
            expenseCategory: 'Approved',
          }}
          component={ExpensesTab}
          options={{
            tabBarLabel: ({ focused }) => (
              <CustomTabBarLabel focused={focused} label="Approved" />
            ),
          }}
        />
        <Tab.Screen
          name={ExpenseRoutes.Paid}
          initialParams={{
            expenseStatus: { status: EXPENSE_STATUSES.PAID },
            expenseCategory: 'Paid',
          }}
          component={ExpensesTab}
          options={{
            tabBarLabel: ({ focused }) => (
              <CustomTabBarLabel focused={focused} label="Paid" />
            ),
          }}
        />
        <Tab.Screen
          name={ExpenseRoutes.Disapproved}
          initialParams={{
            expenseStatus: { is_disapproved: 1 },
            expenseCategory: 'Disapproved',
          }}
          component={ExpensesTab}
          options={{
            tabBarLabel: ({ focused }) => (
              <CustomTabBarLabel focused={focused} label="Disapproved" />
            ),
          }}
        />
      </Tab.Navigator>
      <SubmitButton
        onPress={() => navigation.navigate(ExpenseRoutesRedesign.ExpenseOptions)}
        title="Record Expense"
      />
    </Box>
  )
}

export default Expenses
