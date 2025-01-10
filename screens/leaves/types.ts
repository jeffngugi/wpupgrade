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
}
