import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from '../screens/home/Home'
import HomeTabIcon from '../components/HomeTabIcon'
import { HomeTabParamList, segmentUserTrait } from '../types'
import MenuScreen from '../screens/menu/MenuScreen'
import WalletScreen from '../screens/wallet/WalletScreen'
import AccountScreen from '../screens/account/AccountScreen'
import { useFetchProfile } from '~api/home'
import LoaderScreen from '~components/LoaderScreen'
import { useAccountSettings, useEnabledFeatures } from '~api/settings'
import { analyticsGroupUser, analyticsIdentifyUser } from '~utils/analytics'
import { isFeatureEnabled } from '~utils/hooks/useMenuItems'
import { useMyProfile } from '~api/account'
import { State } from '~declarations'
import { useSelector } from 'react-redux'
import Playground from '~Playground'

const BottomTab = createBottomTabNavigator<HomeTabParamList>()

const HomeTabNavigator = () => {
  const { isLoading, data: profileData } = useFetchProfile()
  const { data: myProfileData } = useMyProfile()
  const { isLoading: loading } = useAccountSettings()
  const { isLoading: loadingFeatures, data: featuresData } =
    useEnabledFeatures()
  const myProfileInfo = myProfileData?.data
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)

  const enabledFeatures = featuresData?.data?.data ?? []
  const walletEnabled = isFeatureEnabled('employee-wallet', enabledFeatures)

  const profileInfo = profileData?.data

  const segmentProperties: segmentUserTrait = {
    uniqueUserId: profileInfo?.allowed_company_id,
    sharedUserId: profileInfo?.id,
    isCompanyOwner: profileInfo?.is_company_owner,
    employeeId: employee_id,
    name: myProfileInfo?.employee_name,
    company: {
      id: profileInfo?.company_id,
      name: profileInfo?.company_name,
      branchName: myProfileInfo?.branch_name,
    },
  }

  useEffect(() => {
    analyticsIdentifyUser(profileInfo?.allowed_company_id, segmentProperties)
    if (segmentProperties?.company?.id) {
      analyticsGroupUser(
        segmentProperties?.company?.id,
        segmentProperties.company,
      )
    }
  }, [profileInfo, myProfileInfo, segmentProperties])

  if (isLoading || loading || loadingFeatures) return <LoaderScreen />

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          return <HomeTabIcon focused={focused} name={route.name} />
        },
        headerShown: false,
        tabBarActiveTintColor: '#62A446',
        tabBarInactiveTintColor: '#536171',
        tabBarIconStyle: { width: 24, height: 24 },
        tabBarStyle: { height: 76, paddingBottom: 10, paddingTop: 10 },
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: 'moderat-medium',
          lineHeight: 17,
        },
      })}>
      <BottomTab.Screen name="Home" component={Home} />
      {walletEnabled ? (
        <BottomTab.Screen name="Wallet" component={WalletScreen} />
      ) : null}
      <BottomTab.Screen name="Menu" component={MenuScreen} />
      <BottomTab.Screen name="Account" component={AccountScreen} />
      <BottomTab.Screen name="playground" component={Playground} />
    </BottomTab.Navigator>
  )
}
export default HomeTabNavigator
