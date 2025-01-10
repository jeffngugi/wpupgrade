import React from 'react'
import { Box, Heading, HStack } from 'native-base'
import {
  isFeatureEnabled,
  TMenuItem,
  useMenuItems,
} from '~utils/hooks/useMenuItems'
import { useNavigation } from '@react-navigation/native'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import QuickItem from '~components/QuickItem'
import { sortBy } from 'lodash'
import { LeaveRoutes, LeaveRoutesRedesign } from '~types'
import { useEnabledFeatures } from '~api/settings'

const QuickActions = () => {
  const navigation = useNavigation()
  const { menuItems } = useMenuItems()
  const { data } = useEnabledFeatures()

  const enabledFeatures = data?.data?.data ?? []
  const revampedLeave = isFeatureEnabled('leave_design_revamp', enabledFeatures)

  const quickItemNavigate = (route: string, index: number) => () => {
    switch (index) {
      case 0:
        analyticsTrackEvent(AnalyticsEvents.Home.apply_for_leave, {})
        break
      case 1:
        analyticsTrackEvent(AnalyticsEvents.Home.claim_an_expense, {})
        break
      case 2:
        analyticsTrackEvent(AnalyticsEvents.Home.earned_wage_access, {})
        break
      case 3:
        analyticsTrackEvent(AnalyticsEvents.Home.apply_loan, {})
        break
      default:
        break
    }

    if (route) {
      if (route === LeaveRoutes.Leave || route === LeaveRoutesRedesign.Leave) {
        if (revampedLeave) {
          navigation.navigate(LeaveRoutesRedesign.Request)
          return
        }
        navigation.navigate(LeaveRoutes.Request)
        return
      }
      navigation.navigate(route)
    }
  }
  const quickItems = sortBy<TMenuItem>(menuItems, 'quickAccess')
  return (
    <Box marginTop="20px">
      <Heading marginY="6px" fontSize="20px">
        What you want to do today?
      </Heading>
      <HStack
        justifyContent="space-between"
        paddingY="2px"
        textAlign="center"
        mt="24px">
        {quickItems.slice(0, 4).map((item, index) => (
          <QuickItem
            item={item}
            Icon={item.Icon}
            label={item.label}
            onPress={quickItemNavigate(item.route, index)}
            key={index}
          />
        ))}
      </HStack>
    </Box>
  )
}

export default QuickActions
