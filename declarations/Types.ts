import AppReducer from '~/store/reducers'
import { appLocales } from '~locale/loadLocale'
import * as Actions from './Interfaces'
import { SvgProps } from 'react-native-svg'

export type State = ReturnType<typeof AppReducer>
export type Environment = 'test' | 'staging' | 'production'
export type SupportedLocale = keyof typeof appLocales
export type DeveloperTool = 'environment' | 'language'
export type Environments = {
  test: string
  staging: string
  production: string
}

export type LoggedUser = {
  token: string
  id: number | string
  employee_id: number | string
  company_id: number | string
}

export enum AppState {
  Background = 'Background',
  Active = 'Active',
  Inactive = 'Inactive',
}

export type Module =
  | 'Loans'
  | 'Leaves'
  | 'Salary Advance'
  | 'Expenses'
  | 'EWA'
  | 'Payslips'
  | 'Payroll'

export type MenuItemType = {
  name: string
  description: string
  Icon: React.FC<SvgProps>
  new?: boolean
  route: string | null
}
  ;[]

export type NotificationAction =
  | Actions.SetNotifications
  | Actions.SetNotificationsError
  | Actions.AddNotification
  | Actions.AddNotifications
  | Actions.DeleteNotification
  | Actions.MarkNotificationAsRead
  | Actions.ResetNotifications

export type LocaleAction = Actions.SetUserPreferredLocale
export type EnvironmentAction = Actions.SwitchEnvironment
export type AppAction =
  | NotificationAction
  | EnvironmentAction
  | LocaleAction
  | any

export type OnboardingAction = Actions.SetOnboarded

export type NetworkAction = Actions.SetNetwork

export type UserAction = Actions.SetUser | Actions.LogoutUser

export type ApplicationAction =
  | Actions.SetAppLocked
  | Actions.SetAppMinVersion
  | Actions.GetMinAppVersion
  | Actions.SetRequirePinOnAppOpen
  | Actions.SetAppUnlocked
  | Actions.SetAppState
  | Actions.SetLockPinAvailable
  | Actions.SetLockPin
  | Actions.SetLockingEnabled
  | Actions.SetFingerPrintEnabled
  | Actions.SetBiometricEnabled
  | Actions.SkipBiometrics
  | Actions.SetFaceIdEnabled
  | Actions.SetSkipPinSetUp
  | Actions.SetShowAmount

export type TAAction =
  | Actions.ResetClockInOut
  | Actions.AddClockInOut
  | Actions.DeleteClockInOut
  | Actions.AddClockInOutAttempts
  | Actions.EditClockInOutAttempt


export type ExpenseAction =
  | Actions.SetExpenseItem

