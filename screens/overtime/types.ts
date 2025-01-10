export type TOvertime = {
  company_id: number
  currency_code: string
  date: string
  employee_id: number
  frequency: string
  hours: string
  hours_2_0x: string
  id: number
  month: string | null
  notes: string | null
  status: TOvertimeStatus | null
  time_from: string
  year: string
}

export type TOvertimeStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | ''
export type TAdvanceApprovalStatus =
  | 'PENDING,CERTIFIED'
  | 'APPROVED'
  | 'DISAPPROVED'
  | ''

export type TAdvanceRequestParams = {
  approval_status: TAdvanceApprovalStatus
  paid?: 1 | 0
}
