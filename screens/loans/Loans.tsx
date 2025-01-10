import React from 'react'
import { Box } from 'native-base'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ScreenHeader from '~components/ScreenHeader'
import { LoanRoutes } from '~types'
import LoansTab from './LoansTab'
import { LOAN_STATUSES } from './constants'
import { tabBarScreenOptions } from '~theme/components/tabBarStyles'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'

const Loans = ({ navigation }) => {
  const Tab = createMaterialTopTabNavigator()
  useStatusBarBackgroundColor('white')
  return (
    <Box safeArea flex={1} backgroundColor="white" px="16px">
      <ScreenHeader onPress={() => navigation.goBack()} title="Loans" />
      <Box mt={'24px'} />
      <Tab.Navigator screenOptions={tabBarScreenOptions}>
        <Tab.Screen
          name={LoanRoutes.Pending}
          initialParams={{
            loanStatus: LOAN_STATUSES.PENDING,
            loanCategory: 'Pending',
          }}
          component={LoansTab}
          options={{ tabBarLabel: 'Requested' }}
        />
        <Tab.Screen
          name={LoanRoutes.Active}
          initialParams={{
            loanStatus: LOAN_STATUSES.ACTIVE,
            loanCategory: 'Active',
          }}
          component={LoansTab}
          options={{ tabBarLabel: 'Approved' }}
        />

        <Tab.Screen
          name={LoanRoutes.Paused}
          initialParams={{
            loanStatus: LOAN_STATUSES.PAUSED,
            loanCategory: 'Paused',
          }}
          component={LoansTab}
          options={{ tabBarLabel: 'Paused' }}
        />
        <Tab.Screen
          name={LoanRoutes.Disapproved}
          component={LoansTab}
          initialParams={{
            loanStatus: LOAN_STATUSES.INACTIVE,
            loanCategory: 'Dissaproved',
          }}
          options={{ tabBarLabel: 'Disapproved' }}
        />
        <Tab.Screen
          name={LoanRoutes.Completed}
          component={LoansTab}
          initialParams={{
            loanStatus: LOAN_STATUSES.COMPLETED,
            loanCategory: 'Completed',
          }}
          options={{ tabBarLabel: 'Completed' }}
        />
        <Tab.Screen
          name={LoanRoutes.All}
          initialParams={{ loanStatus: LOAN_STATUSES.ALL, loanCategory: 'ALL' }}
          component={LoansTab}
          options={{ tabBarLabel: 'All' }}
        />
      </Tab.Navigator>
    </Box>
  )
}

export default Loans
