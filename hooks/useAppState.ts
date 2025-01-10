import { useCallback, useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

export function useAppState(): AppStateStatus {
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  )
  const handleStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (nextAppState !== appState) {
        setAppState(nextAppState)
      }
    },
    [appState],
  )
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleStateChange)
    return () => subscription.remove()
  }, [handleStateChange])
  return appState
}

export function useDebouncedAppState(
  callback: (appState: AppStateStatus) => void,
) {
  const initialState = null
  const [lastState, setLastState] = useState<AppStateStatus>(initialState)
  const cb = useDebouncedCallback(callback, 250, {
    leading: true,
    trailing: true,
    maxWait: 500,
  })
  const appState = useAppState()
  useEffect(() => {
    if (lastState === appState) return
    setLastState(appState)
    cb(appState)
  }, [appState, cb, lastState])
}
