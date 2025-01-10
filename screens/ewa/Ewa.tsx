import React from 'react'
import { Box } from 'native-base'
import { StyleSheet } from 'react-native'
import ScreenHeader from '../../components/ScreenHeader'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import EwaHome from './EwaHome'
import EwaTrasactions from './EwaTrasactions'
import { tabBarScreenOptions } from '~theme/components/tabBarStyles'
import _ from 'lodash'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'

const Ewa = ({ navigation }) => {
  const Tab = createMaterialTopTabNavigator()
  useStatusBarBackgroundColor('white')
  return (
    <Box flex={1} safeArea backgroundColor="white">
      <Box paddingX="16px" backgroundColor="red`">
        <ScreenHeader
          title="Earned Wage Access"
          onPress={() => navigation.goBack()}
        />
      </Box>
      <Box mt={'24px'}></Box>
      <Tab.Navigator
        screenOptions={{
          ..._.omit(tabBarScreenOptions, 'tabBarScrollEnabled'),
        }}>
        <Tab.Screen name="EARNINGS" component={EwaHome} />
        <Tab.Screen name="TRANSACTIONS" component={EwaTrasactions} />
      </Tab.Navigator>
    </Box>
  )
}

export default Ewa

const styles = StyleSheet.create({
  tabbarIndicator: {
    backgroundColor: '#62A446',
    height: 2,
  },
  tabBarLabelStyle: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'moderat-medium',
  },
})
