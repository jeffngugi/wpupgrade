import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../types'
import Slide from '../screens/onboarding/Slide'
import LoginScreen from '../screens/authentication/LoginScreen'
import ForgotPasswordScreen from '../screens/authentication/ForgotPasswordScreen'
import VerificationCodeScreen from '../screens/authentication/VerificationCodeScreen'
import ResetPassword from '../screens/authentication/ResetPassword'
import Confirmation from '../screens/authentication/Confirmation'
import { useSelector } from 'react-redux'
import { State } from '~declarations'

const AuthStack = createNativeStackNavigator<AuthStackParamList>()

const { Screen, Navigator } = AuthStack

const AuthStackNavigator = () => {
  const { onboarded } = useSelector((state: State) => state.onboarding)
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {onboarded ? (
        <>
          <Screen name="Login" component={LoginScreen} />
          <Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Screen name="VerificationCode" component={VerificationCodeScreen} />
          <Screen name="ResetPassword" component={ResetPassword} />
          <Screen name="ConfirmPassword" component={Confirmation} />
        </>
      ) : (
        <Screen name="Slider" component={Slide} />
      )}
    </Navigator>
  )
}

export default AuthStackNavigator
