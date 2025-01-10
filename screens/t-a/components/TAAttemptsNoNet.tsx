import React from 'react'
import ScreenHeader from '~components/ScreenHeader'
import { Box } from 'native-base'
import ColorScreenHero from '~components/ColorScreenHero'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { CustomStatusBar } from '~components/customStatusBar'
import TAHeroCard from './TAHeroCard'
import AttemptsListing from './AttemptsListing'

const TA = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor="#F1FDEB" />
      <Box flex={1} backgroundColor="white">
        <ColorScreenHero padding>
          <ScreenHeader
            onPress={() => navigation.goBack()}
            title="Time & Attendance"
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
