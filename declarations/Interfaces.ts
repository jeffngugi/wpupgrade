import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import {
  NetInfoCellularGeneration,
  NetInfoStateType,
} from '@react-native-community/netinfo'
import {
  Environment,
  Environments,
  Module,
  SupportedLocale,
  LoggedUser,
  AppState,
} from './Types'
import ActionTypes from '~/store/actions/types'

export interface LocaleState {
  userPreferredLocale: SupportedLocale | null
}
export interface NotificationsState {
  loading: boolean
  notifications: Notification[] | null
  error: boolean
}

export interface OnboardingState {
  onboarded: boolean
}

export interface NetworkState {
  networkType: NetInfoStateType
  networkConnected: boolean
  internetReachable: boolean
  details: T_APP_NETWORK_DETAILS | null
}

export type T_APP_NETWORK_DETAILS = {
  isConnectionExpensive: boolean
  cellularGeneration?: NetInfoCellularGeneration
  carrier?: string
  ssid?: string | null
  bssid?: string | null
  strength?: number
  ipAddress?: string
  subnet?: string
  frequency?: number
}

export interface UserState {
  isLoggedIn: boolean
  user: LoggedUser
}

export interface ApplictionState {
  requirePinOnAppOpen: boolean
  locked: boolean
  appState: AppState
  minVersion: string | null
  lockPin: string | null
  lockPinAvailable: false
  lockingEnabled: boolean
  fingerprintEnabled: boolean
  biometricEnabled: boolean
  skipBioMetrics: boolean
  faceIdEnabled: boolean
  skipPinSetUp: boolean
  showAmount: boolean
}

export interface EnvironmensState {
  current: Environment
  environments: Environments
}

export interface Notification extends FirebaseMessagingTypes.Notification {
  id?: number | string
  read: boolean
  iconURI?: string
  meta: {
    id: number | string
    module: Module
  }
}

export interface ClockInOut {
  id?: number
  clockId: number | string
  company_id: string | number
  employee_id: string | number
  latitude: string | number
  longitude: string | number
  submitted: 1 | 0
  expireAt: string
  status: 'pending' | 'failed' | 'success'
  message: string
  time_in?: string
  time_out?: string
  check_point?: string | number
  address?: string
  detection_mode: 'Qr_code' | 'QR' | 'EASY'
  checkpoint?: string
  project_id?: string
  supervisor_id?: string
  qr_code_company_id?: string | number
  clock_in?: boolean
}

export interface TAState {
  clockInsOuts: ClockInOut[] | null
}

export interface SetUserPreferredLocale {
  type: ActionTypes.SET_USER_PREFERRED_LOCALE
  payload: SupportedLocale | null
}

export interface SetNotifications {
  type: ActionTypes.SET_NOTIFICATIONS
  payload: Notification[]
}

export interface SetNotificationsError {
  type: ActionTypes.SET_NOTIFICATIONS_ERROR
}

export interface AddNotification {
  type: ActionTypes.ADD_NOTIFICATION
  payload: Notification
}

export interface AddNotifications {
  type: ActionTypes.ADD_NOTIFICATIONS
  payload: Notification[]
}

export interface DeleteNotification {
  type: ActionTypes.DELETE_NOTIFICATION
  payload: Notification
}

export interface MarkNotificationAsRead {
  type: ActionTypes.MARK_NOTIFICATION_AS_READ
  payload: Notification
}

export interface ResetNotifications {
  type: ActionTypes.RESET_NOTIFICATIONS
}

export interface SwitchEnvironment {
  type: ActionTypes.SWITCH_ENVIRONMENT
  payload: Environment
}

export interface SetOnboarded {
  type: ActionTypes.SET_ONBOARDED
}

export type SetNetwork = {
  type: ActionTypes.SET_NETWORK
  payload: NetworkState
}
export interface SetUser {
  type: ActionTypes.SET_USER
  payload: LoggedUser
}

export interface LogoutUser {
  type: ActionTypes.LOGOUT_USER
}

export interface GetMinAppVersion {
  type: ActionTypes.GET_MIN_VERSION
}

export interface SetAppMinVersion {
  type: ActionTypes.SET_MIN_VERSION
  payload: string | null
}

export interface SetAppLocked {
  type: ActionTypes.APP_LOCKED
}

export interface SetAppUnlocked {
  type: ActionTypes.APP_UNLOCKED
}

export interface SetRequirePinOnAppOpen {
  type: ActionTypes.REQUIRE_PIN_TO_OPEN
  payload: boolean
}

export interface SetAppState {
  type: ActionTypes.SET_APP_STATE
  payload: AppState
}

export interface SetLockPinAvailable {
  type: ActionTypes.SET_LOCK_PIN_AVAILABLE
  payload: boolean
}

export interface SetLockPin {
  type: ActionTypes.SET_LOCK_PIN
  payload: string | null
}
export interface AddClockInOut {
  type: ActionTypes.ADD_CLOCKINOUT
  payload: ClockInOut
}

export interface DeleteClockInOut {
  type: ActionTypes.DELETE_CLOCKINOUT
  payload: ClockInOut
}

export interface ResetClockInOut {
  type: ActionTypes.RESET_CLOCKINOUT
}

export interface AddClockInOutAttempts {
  type: ActionTypes.ADD_TA_ATTEMPTS
  payload: ClockInOut[]
}

export interface EditClockInOutAttempt {
  type: ActionTypes.EDIT_TA_ATTEMPT
  payload: ClockInOut
}

export type SetLockingEnabled = {
  type: ActionTypes.SET_LOCKING_ENABLED
  payload: boolean
}

export type SetFingerPrintEnabled = {
  type: ActionTypes.SET_FINGERPRINT_ENABLED
  payload: boolean
}

export type SetBiometricEnabled = {
  type: ActionTypes.SET_BIOMETRIC_ENABLED
  payload: boolean
}

export type SkipBiometrics = {
  type: ActionTypes.SKIP_BIOMETRICS
  payload: boolean
}

export type SetFaceIdEnabled = {
  type: ActionTypes.FACE_ID_ENABLED
  payload: boolean
}

export type SetSkipPinSetUp = {
  type: ActionTypes.SKIP_PIN_SET_UP
  payload: boolean
}

export type SetShowAmount = {
  type: ActionTypes.SHOW_AMOUNT
  payload: boolean
}

export type SetExpenseItem = {
  type: ActionTypes.SET_EXPENSE_ITEM
  payload: any
}
