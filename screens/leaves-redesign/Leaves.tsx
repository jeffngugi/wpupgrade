import React from 'react'
import { Box } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { LeaveRoutes, LeaveRoutesRedesign } from '~types'
import ColorScreenHero from '~components/ColorScreenHero'
import { useLeaveBalances } from '~api/leave'
import LoaderScreen from '~components/LoaderScreen'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import ImageCarousel from './ImageCarousel'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { tabBarScreenOptions } from '~theme/components/tabBarStyles'
import { CustomStatusBar } from '~components/customStatusBar'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import LeavesTab from './LeavesTab'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
import useRemotePayrollEnabled from '~utils/hooks/remote-payroll-enabled'
import OutlineButtonIcon from '~components/buttons/OutlineButtonIcon'
import { TLeaveItem } from './types'

const LEAVE_PARAM_STATUSES = {
  ALL: 'All',
  NOT_APPROVED: 'NOT_APPROVED',
  NOT_CERTIFIED: 'NOT_CERTIFIED',
  APPROVED: 'APPROVED',
  DISAPPROVED: 'DISAPPROVED',
  ACTIVE: 'ACTIVE',
  ATTENDED: 'INACTIVE',
}

const Leaves = () => {
  const navigation = useNavigation()
  const Tab = createMaterialTopTabNavigator()
  const { t } = useTranslation('leaves')
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)
  const { remoteEnabled } = useRemotePayrollEnabled()
  const leaveBalances = useLeaveBalances({
    employeeId: employee_id,
  })
  const isLoading = leaveBalances.isLoading
  useStatusBarBackgroundColor('#F1FDEB')

  if (isLoading) {
    return <LoaderScreen />
  }

  const leavePolicies: TLeaveItem[] = remoteEnabled
    ? leaveBalances?.data?.data ?? []
    : leaveBalances?.data?.data?.[0]?.employeeleaves ?? []

  const leavePoliciesWithIds = leavePolicies.map((policy, index) => {
    return { ...policy, id: index }
  })

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor="#F1FDEB" />
      <Box flex={1} backgroundColor="white">
        <ColorScreenHero>
          <Box px="16px">
            <ScreenHeader
              onPress={() => navigation.goBack()}
              title={t('leaves')}
            />
          </Box>

          <ImageCarousel data={leavePoliciesWithIds} />

        </ColorScreenHero>
        <Box my={'10px'}></Box>
        <Tab.Navigator screenOptions={tabBarScreenOptions}>
          <Tab.Screen
            name={LeaveRoutes.All}
            component={LeavesTab}
            initialParams={{
              status: LEAVE_PARAM_STATUSES.ALL,
              category: 'ALL',
            }}
            options={{ tabBarLabel: t('all') }}
          />
          <Tab.Screen
            name={LeaveRoutes.Pending}
            component={LeavesTab}
            initialParams={{
              status: `${LEAVE_PARAM_STATUSES.NOT_APPROVED},${LEAVE_PARAM_STATUSES.NOT_CERTIFIED}`,
              category: 'submitted',
            }}
            options={{ tabBarLabel: t('submitted') }}
          />
          <Tab.Screen
            name={LeaveRoutes.Approved}
            component={LeavesTab}
            initialParams={{
              status: LEAVE_PARAM_STATUSES.APPROVED,
              category: 'approved',
            }}
            options={{ tabBarLabel: t('approved') }}
          />
          <Tab.Screen
            name={LeaveRoutes.Active}
            component={LeavesTab}
            initialParams={{
              status: LEAVE_PARAM_STATUSES.ACTIVE,
              category: 'active',
            }}
            options={{ tabBarLabel: t('active') }}
          />
          <Tab.Screen
            name={LeaveRoutes.Attended}
            component={LeavesTab}
            initialParams={{
              status: LEAVE_PARAM_STATUSES.ATTENDED,
              category: 'attended',
            }}
            options={{ tabBarLabel: t('attended') }}
          />
          <Tab.Screen
            name={LeaveRoutes.Disapproved}
            component={LeavesTab}
            initialParams={{
              status: LEAVE_PARAM_STATUSES.DISAPPROVED,
              category: 'disapproved',
            }}
            options={{ tabBarLabel: t('disapproved') }}
          />
        </Tab.Navigator>
      </Box>
    </SafeAreaProvider>
  )
}

export default Leaves
