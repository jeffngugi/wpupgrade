import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { Platform, StatusBar } from 'react-native'

export function useStatusBarBackgroundColor(color: string) {
  useFocusEffect(() => {
    Platform.OS === 'android' && StatusBar.setBackgroundColor(color)
  })
}
