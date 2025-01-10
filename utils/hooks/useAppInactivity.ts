import moment from 'moment'
import React, { useCallback, useEffect, useRef } from 'react'
import { PanResponder } from 'react-native'
import store from '~store'
import { appLock } from '~store/actions/Application'

export function useAppInactivity() {
  const [isInactive, setIsInactive] = React.useState(false)

  // Ref to store the timestamp of the last interaction
  const lastInteraction = React.useRef(moment())
  // Ref to store the ID of the inactivity timer
  const inactivityTimer = React.useRef<NodeJS.Timeout | null>(null)
  // Set the time limit for inactivity logout (5 minutes)
  const IDLE_LOGOUT_TIME_LIMIT = 3 * 60 * 1000

  // Function to reset interaction time
  const resetInteractionTime = useCallback(() => {
    lastInteraction.current = moment()
    // console.log('lastInteraction reset', lastInteraction.current)
    if (isInactive) {
      setIsInactive(false)
    }
  }, [isInactive])
  //reset interaction as a normal fn

  // Initialize the PanResponder to reset interaction time
  const _panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture(e, gestureState) {
        // console.log('onStartShouldSetPanResponderCapture', e, gestureState)
        resetInteractionTime()
        return false
      },
    }),
  ).current

  // Function to check inactivity and trigger logout if needed
  const checkInactive = React.useCallback(() => {
    // Check if the inactivity timer is already running
    const lockingEnabled = store.getState().application?.lockingEnabled as any

    if (inactivityTimer.current || !lockingEnabled) {
      return
    }
    return // disable
    // Start the inactivity timer
    inactivityTimer.current = setInterval(() => {
      const { locked } = store.getState().application
      // Get the current time
      const currentTime = moment()
      // Calculate the elapsed time since the last interaction
      const elapsedTime = moment(currentTime).diff(lastInteraction.current)
      // Check if the elapsed time exceeds the defined time limit
      console.log('elapsedTime', elapsedTime)
      const lockingEnabled = store.getState().application?.lockingEnabled as any
      if (elapsedTime >= IDLE_LOGOUT_TIME_LIMIT && !locked && lockingEnabled) {
        // Trigger the function to handle inactivity logout
        setIsInactive(true)
        store.dispatch(appLock())
      }
    }, 1000 * 10) // Check every second
  }, [setIsInactive])

  useEffect(() => {
    // Initialize inactivity tracking when the component mounts
    // checkInactive()
    // Cleanup function to clear the inactivity timer on component unmount
    // return () => {
    //   if (inactivityTimer.current) {
    //     clearInterval(inactivityTimer.current)
    //     inactivityTimer.current = null // Reset the reference to null
    //   }
    // }
  }, [checkInactive, setIsInactive])

  return {
    isInactive,
    setIsInactive,
    _panResponder,
    resetInteractionTime,
    checkInactive,
  }
}
