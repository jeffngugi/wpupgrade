import React from 'react'
import { Box, Text, Heading, HStack, VStack } from 'native-base'
import GridListBtn from '../../../components/GridListBtn'
import { AnalyticsEvents } from '~utils/analytics/events'
import { analyticsTrackEvent } from '~utils/analytics'

type Props = {
  gridView: boolean
  setGridView: (x: boolean) => void
}

const MenuHeader = ({ gridView, setGridView }: Props) => {
  const setEvent = (gridView: boolean) => {
    if (gridView) {
      analyticsTrackEvent(AnalyticsEvents.MenuEvents.select_list_view, {})
    } else {
      analyticsTrackEvent(AnalyticsEvents.MenuEvents.select_grid_view, {})
    }
  }
  return (
    <Box marginBottom="24px" marginX="16px" marginTop={'16px'}>
      <HStack>
        <VStack mr={'auto'} justifyContent="space-between">
          <Heading fontSize="24px" color={'charcoal'}>
            Menu
          </Heading>
          <Text fontSize="16px" color={'grey'}>
            All your modules in one place
          </Text>
        </VStack>
        <GridListBtn
          gridView={gridView}
          onPress={() => {
            setGridView(!gridView)
            setEvent(gridView)
          }}
        />
      </HStack>
    </Box>
  )
}

export default MenuHeader
