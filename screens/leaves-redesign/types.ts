import { optionsType } from '~components/DropDownPicker'

export type TLeaveItem = {
  allow_negative_balance: number
  approved_attempts_count: number
  days: string
  deleted_at: string | null
  disapprove_reason: string | null
  document_link: []
  duration: string
  employee_id: number | string
  employee_name: string
  from: string
  half_day_option: string
  hours: string
  id: string
  is_half_day: 1 | 0
  leave_type_id: number
  leave_type_name: string
  leave_type_taken_days: string
  no_of_documents: number
  reason: string
  recalled: string
  reject_reason: string | null
  reliever_id: number | null
  reliever_name: string
  require_support_document: 1 | 0
  status: string
  to: string
  approved_attempts: ApprovedAttempts[]
  approval_stages: []
}

export type ApprovedAttempts = {
  action_taken: 'APPROVED' | 'REJECTED' | 'PENDING' // Example of possible values
  created_at: string // ISO date string
  external_id: number
  id: number
  stage: string
  type: string // In this case, it is "LEAVE", but other types might exist
  updated_at: string // ISO date string
  user_id: number
  user_name: string
}

export type LeaveOptionsType = optionsType & {
  no_of_documents: number
  available_balance: number
  leave_name: string
  balance_days: number
}

export type AccountSetting = {
  data: {
    show_leave_time: boolean | string
    leave_return_input_type: 'DAYS_AND_HOURS' | 'RETURN_DATE'
    leave_approve_stages: number | string
  }
}

export type OnSubmitLeaveData = {
  leave_type_id: string | number
  start_date: string | Date | undefined
  return_date: string | Date | undefined
  reason: string
  reliever_id: string | number | null
  is_half_day: boolean
  to: string | Date
  from: string | Date
  days: string | number
  hours: string
  half_day_option: string
  day_option: string
  reliever: string | number | null
}
