import {
  SetAppLocked,
  SetAppUnlocked,
  SetRequirePinOnAppOpen,
  SetAppState,
  SetAppMinVersion,
  AppState,
  SetLockPinAvailable,
  SetLockPin,
  SetLockingEnabled,
  SetFingerPrintEnabled,
  SetBiometricEnabled,
  SkipBiometrics,
  SetFaceIdEnabled,
  SetSkipPinSetUp,
  SetShowAmount,
} from '~declarations'
import ActionTypes from '~store/actions/types'

export const appLock = (): SetAppLocked => ({
  type: ActionTypes.APP_LOCKED,
})

export const appUnlock = (): SetAppUnlocked => ({
  type: ActionTypes.APP_UNLOCKED,
})

export const requirePinOnAppOpen = (
  payload: boolean,
): SetRequirePinOnAppOpen => ({
  type: ActionTypes.REQUIRE_PIN_TO_OPEN,
  payload,
})

export const setAppState = (payload: AppState): SetAppState => ({
  type: ActionTypes.SET_APP_STATE,
  payload,
})

export const setAppMinVersion = (payload: string): SetAppMinVersion => ({
  type: ActionTypes.SET_MIN_VERSION,
  payload,
})

export const setLockingEnabled = (payload: boolean): SetLockingEnabled => ({
  type: ActionTypes.SET_LOCKING_ENABLED,
  payload,
})

export const setFingerPrintEnabled = (
  payload: boolean,
): SetFingerPrintEnabled => ({
  type: ActionTypes.SET_FINGERPRINT_ENABLED,
  payload,
})

export const setBiometricEnabled = (payload: boolean): SetBiometricEnabled => ({
  type: ActionTypes.SET_BIOMETRIC_ENABLED,
  payload,
})

export const skipBiometrics = (payload: boolean): SkipBiometrics => ({
  type: ActionTypes.SKIP_BIOMETRICS,
  payload,
})

export const setLockPinAvailable = (payload: boolean): SetLockPinAvailable => ({
  type: ActionTypes.SET_LOCK_PIN_AVAILABLE,
  payload,
})

export const setLockPin = (payload: string | null): SetLockPin => ({
  type: ActionTypes.SET_LOCK_PIN,
  payload,
})

export const setFaceIdEnabled = (payload: boolean): SetFaceIdEnabled => ({
  type: ActionTypes.FACE_ID_ENABLED,
  payload,
})

export const setSkipPinSetUp = (payload: boolean): SetSkipPinSetUp => ({
  type: ActionTypes.SKIP_PIN_SET_UP,
  payload,
})

export const setShowAmount = (payload: boolean): SetShowAmount => ({
  type: ActionTypes.SHOW_AMOUNT,
  payload,
})
