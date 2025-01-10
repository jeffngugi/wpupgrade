import { AppState, ApplictionState, ApplicationAction } from '~declarations'
import ActionTypes from '~store/actions/types'

const currentState: ApplictionState = {
  requirePinOnAppOpen: true,
  appState: AppState.Active,
  minVersion: null,
  lockingEnabled: false,
  locked: false,
  lockPin: null,
  lockPinAvailable: false,
  fingerprintEnabled: false,
  biometricEnabled: false,
  skipBioMetrics: false,
  faceIdEnabled: false,
  skipPinSetUp: false,
  showAmount: false,
}

const reducer = (state = currentState, action: ApplicationAction) => {
  switch (action.type) {
    case ActionTypes.APP_LOCKED:
      return {
        ...state,
        locked: true,
      }
    case ActionTypes.APP_UNLOCKED:
      return {
        ...state,
        locked: false,
      }
    case ActionTypes.REQUIRE_PIN_TO_OPEN:
      return {
        ...state,
        requirePinOnAppOpen: action.payload,
      }
    case ActionTypes.SET_APP_STATE:
      return {
        ...state,
        appState: action.payload,
      }
    case ActionTypes.SET_MIN_VERSION:
      return {
        ...state,
        minVersion: action.payload,
      }
    case ActionTypes.SET_LOCK_PIN_AVAILABLE:
      return {
        ...state,
        lockPinAvailable: action.payload,
      }
    case ActionTypes.SET_LOCK_PIN:
      return {
        ...state,
        lockPin: action.payload,
      }
    case ActionTypes.SET_LOCKING_ENABLED:
      return {
        ...state,
        lockingEnabled: action.payload,
      }
    case ActionTypes.SET_FINGERPRINT_ENABLED:
      return {
        ...state,
        fingerprintEnabled: action.payload,
      }
    case ActionTypes.SET_BIOMETRIC_ENABLED:
      return {
        ...state,
        biometricEnabled: action.payload,
      }
    case ActionTypes.SKIP_BIOMETRICS:
      return {
        ...state,
        skipBioMetrics: action.payload,
      }
    case ActionTypes.FACE_ID_ENABLED:
      return {
        ...state,
        faceIdEnabled: action.payload,
      }
    case ActionTypes.SKIP_PIN_SET_UP:
      return {
        ...state,
        skipPinSetUp: action.payload,
      }
    case ActionTypes.SHOW_AMOUNT:
      return {
        ...state,
        showAmount: action.payload,
      }
    default:
      return state
  }
}

export default reducer
