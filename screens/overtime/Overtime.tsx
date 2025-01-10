import { StyleSheet } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { Box } from 'native-base'
import ScreenHeader from '../../components/ScreenHeader'
import { OvertimeRoutes } from '../../types'
import { tabBarScreenOptions } from '~theme/components/tabBarStyles'
import OvertimeTab from './OvertimeTab'

const OVERTIME_STATUSES = {
  ALL: 'All',
  REQUESTED: 'REQUESTED',
  APPROVED: 'APPROVED',
  DISAPPROVED: 'DISAPPROVED',
}

const Overtime = ({ navigation }) => {
  const Tab = createMaterialTopTabNavigator()

  return (
    <Box safeArea flex={1} backgroundColor="white" px="16px">
      <ScreenHeader onPress={() => navigation.goBack()} title="Overtime" />
      <Box mt={'24px'} />
      <Tab.Navigator screenOptions={tabBarScreenOptions}>
        <Tab.Screen
          name={OvertimeRoutes.All}
          component={OvertimeTab}
          initialParams={{
            status: '',
            category: 'All',
          }}
          options={{ tabBarLabel: 'All' }}
        />
        <Tab.Screen
          name={OvertimeRoutes.Requested}
          component={OvertimeTab}
          initialParams={{
            status: OVERTIME_STATUSES.REQUESTED,
            category: 'Requested',
          }}
          options={{ tabBarLabel: 'Requested' }}
        />
        <Tab.Screen
          name={OvertimeRoutes.Approved}
          component={OvertimeTab}
          initialParams={{
            status: OVERTIME_STATUSES.APPROVED,
            category: 'Approved',
          }}
          options={{ tabBarLabel: 'Approved' }}
        />
        <Tab.Screen
          name={OvertimeRoutes.Disapproved}
          component={OvertimeTab}
          initialParams={{
            status: OVERTIME_STATUSES.DISAPPROVED,
            category: 'Disapproved',
          }}
          options={{ tabBarLabel: 'Disapproved' }}
        />
      </Tab.Navigator>
    </Box>
  )
}

export default Overtime

const styles = StyleSheet.create({
  tabbarIndicator: {
    backgroundColor: '#62A446',
    // width: '10%',
    height: 2,
  },
  tabBarLabelStyle: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'moderat-medium',
  },
  container: {},
})
