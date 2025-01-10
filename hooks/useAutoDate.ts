import { useEffect, useState } from 'react'
import { usesAutoDateAndTime } from 'react-native-localize'
import { useAppState } from './useAppState'

const useAutoDate = () => {
  const [autoDate, setAutoDate] = useState(usesAutoDateAndTime())
  const appState = useAppState()
  useEffect(() => {
    setAutoDate(usesAutoDateAndTime())
  }, [appState])
  return { autoDate }
}

export default useAutoDate
