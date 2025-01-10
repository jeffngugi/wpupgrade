import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NoNetParamList, NoNetRoutes } from '~types'
import NoInternetScreen from '~components/NoInternetScreen'
import TAAttemptsNoNet from '~screens/t-a/components/TAAttemptsNoNet'

const NoNetStack = createNativeStackNavigator<NoNetParamList>()
const { Screen, Navigator } = NoNetStack

const NoNetNavigation = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name={NoNetRoutes.NoNet} component={NoInternetScreen} />
      <Screen name={NoNetRoutes.NoNetAttempts} component={TAAttemptsNoNet} />
    </Navigator>
  )
}

export default NoNetNavigation
