import { Dispatch } from 'redux'
import { useDispatch } from 'react-redux'
import { queryClient } from '~ClientApp'
import { ApplicationAction, UserAction } from '~declarations'
import { deleteItem } from '~storage/device-storage'
import { logoutUser } from '~store/actions/User'
import { deleteSecureItem } from '~storage/secureStore'
import {
  setBiometricEnabled,
  setFaceIdEnabled,
  setFingerPrintEnabled,
  setLockingEnabled,
  setLockPin,
  setLockPinAvailable,
} from '~store/actions/Application'
import { deleteDatabase } from '~utils/database/database'

export const useLogout = () => {
  const dispatch: Dispatch<UserAction | ApplicationAction> = useDispatch()
  const logoutAndClearData = () => {
    dispatch(logoutUser())
    // dispatch(setLockPin(null))
    // dispatch(setLockPinAvailable(false))
    deleteItem('userData')
    clearBioMetricsAndPinData()
    deleteDatabase()
    // deleteSecureItem('pin')
    queryClient.removeQueries()
  }

  const clearBioMetricsAndPinData = () => {
    deleteSecureItem('pin')
    dispatch(setLockPin(null))
    dispatch(setLockPinAvailable(false))
    dispatch(setLockingEnabled(false))
    dispatch(setFaceIdEnabled(false))
    dispatch(setBiometricEnabled(false))
    dispatch(setFingerPrintEnabled(false))

    deleteItem('biometricEnabled')
    deleteItem('faceIdEnabled')
    deleteItem('skipBioMetrics')

    deleteItem('lockingEnabled')
    deleteItem('locked')

    dispatch(logoutUser())
    deleteItem('userData')
    deleteDatabase()
    queryClient.removeQueries()
  }

  return { logoutAndClearData, clearBioMetricsAndPinData }
}

export const useLogoutAndClearData = () => {
  const dispatch: Dispatch<UserAction | ApplicationAction> = useDispatch()
  const logoutAndClearPinData = () => {
    deleteSecureItem('pin')
    dispatch(setLockPin(null))
    dispatch(setLockPinAvailable(false))
    dispatch(logoutUser())

    deleteItem('userData')
    deleteDatabase()
    queryClient.removeQueries()
  }
  return { logoutAndClearPinData }
}
