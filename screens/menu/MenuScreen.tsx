import React, { useEffect, useState } from 'react'
import { Box, ScrollView } from 'native-base'
import MenuHeader from './components/MenuHeader'
import GridView from './components/GridView'
import ListView from './components/ListView'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { CustomStatusBar } from '~components/customStatusBar'
import { Platform, StatusBar } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import { useQueryClient } from '@tanstack/react-query'
import { advanceLoanQkeys } from '~api/QueryKeys'

const MenuScreen = () => {
  const [gridView, setGridView] = useState<boolean>(true)
  const queryClient = useQueryClient()

  useFocusEffect(() => {
    Platform.OS === 'android' && StatusBar.setBackgroundColor('white')
    queryClient.invalidateQueries([...advanceLoanQkeys.advances])
    console.log('invalidateQueries')
  })
  useStatusBarBackgroundColor('white')

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor="white" />
      <Box flex={1} backgroundColor="white">
        <MenuHeader setGridView={setGridView} gridView={gridView} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          padding={gridView ? '16px' : 0}>
          {gridView ? <GridView /> : <ListView />}
        </ScrollView>
      </Box>
    </SafeAreaProvider>
  )
}

export default MenuScreen
