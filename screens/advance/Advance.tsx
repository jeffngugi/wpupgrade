import { Platform, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import { Box, Text } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import {
  AdvanceRoutes,
  MainNavigationProp,
  MainNavigationRouteProp,
} from '~types'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ColorScreenHero from '~components/ColorScreenHero'
import ModuleHeroCard from '~components/ModuleHeroCard'
import AdvanceIcon from '~assets/svg/advance.svg'
import { useTranslation } from 'react-i18next'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { CustomStatusBar } from '~components/customStatusBar'
import { tabBarScreenOptions } from '~theme/components/tabBarStyles'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import { useAdvanceLimit } from '~utils/hooks/useAdvanceLimit'
import AdvancesTab from './AdvancesTab'

interface Props {
  navigation: MainNavigationProp<AdvanceRoutes.Advance>
  route: MainNavigationRouteProp<AdvanceRoutes.Advance>
}

const Advance = ({ navigation }: Props) => {
  const Tab = createMaterialTopTabNavigator()
  const { t } = useTranslation('advance')

  useStatusBarBackgroundColor('#F1FDEB')

  const { advanceLimit } = useAdvanceLimit()
  const limitCap = advanceLimit
  useEffect(() => {
    Platform.OS === 'android' && StatusBar.setBackgroundColor('#F1FDEB')
  }, [navigation])

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor="#F1FDEB" />
      <Box flex={1} backgroundColor="white">
        <ColorScreenHero padding>
          <ScreenHeader
            onPress={() => navigation.goBack()}
            title={t('title')}
          />
          <Box height={'24px'} />
          <ModuleHeroCard
            label={t('limit')}
            value={`${limitCap}`}
            Icon={AdvanceIcon}
          />
        </ColorScreenHero>
        <Box height={'24px'} />
        <Tab.Navigator
          screenOptions={tabBarScreenOptions}
          sceneContainerStyle={{
            backgroundColor: 'white',
          }}>
          <Tab.Screen
            name={AdvanceRoutes.All}
            initialParams={{
              status: '',
              category: 'All',
            }}
            component={AdvancesTab}
            options={{ tabBarLabel: 'All' }}
          />
          <Tab.Screen
            name={AdvanceRoutes.Pending}
            initialParams={{
              status: 'PENDING,CERTIFIED',
              category: 'Pending',
            }}
            component={AdvancesTab}
            options={{ tabBarLabel: 'Requested' }}
          />
          <Tab.Screen
            name={AdvanceRoutes.Approved}
            initialParams={{
              status: 'APPROVED',
              category: 'Approved',
            }}
            component={AdvancesTab}
            options={{ tabBarLabel: 'Approved' }}
          />
          <Tab.Screen
            name={AdvanceRoutes.Paid}
            initialParams={{
              status: 'APPROVED',
              category: 'Paid',
            }}
            component={AdvancesTab}
            options={{ tabBarLabel: 'Paid' }}
          />
          <Tab.Screen
            name={AdvanceRoutes.Disapproved}
            initialParams={{
              status: 'DISAPPROVED',
              category: 'Disapproved',
            }}
            component={AdvancesTab}
            options={{ tabBarLabel: 'Disapproved' }}
          />
        </Tab.Navigator>
      </Box>
    </SafeAreaProvider>
  )
}

export default Advance
