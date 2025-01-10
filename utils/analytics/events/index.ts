import { Auth } from './auth'
import { Home } from './home'
import { Accounts } from './accounts'
import { Ewa } from './ewa'
import { Leaves } from './leaves'
import { Expenses } from './expenses'
import { Loans } from './loans'
import { Documents } from './documents'
import { Payslips } from './payslips'
import { MenuEvents } from './menu'
import { TaEvents } from './ta'
import { AdvanceLoans } from './advances-loans'

export const AnalyticsEvents = {
  Auth,
  Home,
  Accounts,
  Ewa,
  Leaves,
  Expenses,
  Loans,
  Documents,
  Payslips,
  MenuEvents,
  TaEvents,
  AdvanceLoans,
}

export type AuthType = (typeof Auth)[keyof typeof Auth]
export type HomeType = (typeof Home)[keyof typeof Home]
export type AccountsType = (typeof Accounts)[keyof typeof Accounts]
export type EwaType = (typeof Ewa)[keyof typeof Ewa]
export type LeavesType = (typeof Leaves)[keyof typeof Leaves]
export type ExpensesType = (typeof Expenses)[keyof typeof Expenses]
export type LoansType = (typeof Loans)[keyof typeof Loans]
export type DocumentsType = (typeof Documents)[keyof typeof Documents]
export type PayslipsType = (typeof Payslips)[keyof typeof Payslips]
export type MenuEventsType = (typeof MenuEvents)[keyof typeof MenuEvents]
export type TaEventsType = (typeof TaEvents)[keyof typeof TaEvents]
export type AdvanceLoansType = (typeof AdvanceLoans)[keyof typeof AdvanceLoans]

export type AnalyticsEventsTypes =
  | AuthType
  | HomeType
  | LeavesType
  | ExpensesType
  | LoansType
  | DocumentsType
  | EwaType
  | AccountsType
  | PayslipsType
  | MenuEventsType
  | TaEventsType
  | AdvanceLoansType
