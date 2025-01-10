import React from 'react'
import ScreenHeader from '~components/ScreenHeader'
import { Box, Menu, Pressable, Text } from 'native-base'
import ColorScreenHero from '~components/ColorScreenHero'
import TAHeroCard from './components/TAHeroCard'
import AttemptsListing from './components/AttemptsListing'
import { TARoutes } from '~types'
import MoreIcon from '~assets/svg/more-vertical.svg'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { CustomStatusBar } from '~components/customStatusBar'

const TA = ({ navigation }: { navigation: any }) => {
  const RightItem = () => (
    <Menu
      w="190"
      defaultIsOpen={false}
      trigger={triggerProps => {
        return (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <MoreIcon color="#253545" />
          </Pressable>
        )
      }}>
      <Menu.Item onPress={() => navigation.navigate(TARoutes.Report)}>
        <Text fontFamily={'body'} fontSize={'16px'}>
          Attendance Report
        </Text>
      </Menu.Item>
    </Menu>
  )

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor="#F1FDEB" />
      <Box flex={1} backgroundColor="white">
        <ColorScreenHero padding>
          <ScreenHeader
            onPress={() => navigation.goBack()}
            title="Time & Attendance"
            RightItem={RightItem}
          />

          <TAHeroCard />
        </ColorScreenHero>
        <Box flex={1}>
          <AttemptsListing />
        </Box>
      </Box>
    </SafeAreaProvider>
  )
}

export default TA
