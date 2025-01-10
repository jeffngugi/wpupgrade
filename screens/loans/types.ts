import { PathString } from 'react-hook-form'

export type TLoan = {
  id: number
  loan_type_id: number
  company_id: number
  employee_id: number
  start_date: Date
  end_date: Date
  duration: number
  rate: string
  principal: string
  monthly_installments: string
  total_amount: string
  total_interest: string
  loan_balance: string
  interest_balance: string
  reason: string
  status: string
  paid: number
  marked_as_paid: number
  currency_id: number
  created_at: Date
  updated_at: Date
  completed_at: null
  date_of_disbursement: null
  topup_reason: null
  pausing_from_date: null
  pausing_to_date: null
  pausing_reason: null
  topped_up_loan_id: null
  pausing_duration: number
  financial_statement_link: string
  proof_of_residence_link: string
  product_admin_status: string
  rejected_reason: null
  funding_type: string
  approval_reason: null
  repaid_to_workpay: number
  is_disbursing: number
  has_extended_amortization: number
  loan_category_type: string
  schedule: any[]
  loan_type_name: string
  employee_name: string
  employee_no: string
  profile_picture: string
  assignment: string
  currency_code: string
  loan_type_type: string
  principal_balance: number
  approved_attempts_count: number
  supervisor_id: null
  country_name: string
  country_flag: string
  approved_attempts: any[]
  amortisation: Amortisation[]
}

export type Amortisation = {
  amount: string
  amount_paid: string
  amount_payable: number
  balance: string
  balance_before: string
  created_at: Date
  currency_code: string
  deleted_at: null
  id: number
  interest: string
  loan_id: number
  month: string
  status: string
  total_deduction: string
  updated_at: Date
  year: number
}

export type LoanReviewDetails = {
  proof_of_residence?: PathString
  financial_statement?: PathString
  principal: string | number
  rate: string | number
  type: string
  noOfMonths: string | number
  startDate: string | Date
  reason: string
  selectedLoanCategory: string
}

export type TLoanDetail = {
  company_id: number
  country_flag: string
  country_name: string
  created_at: Date
  currency_code: string
  currency_id: number
  duration: number
  employee_id: number
  employee_name: string
  employee_no: string
  end_date: Date
  funding_type: string
  id: number
  loan_balance: string
  loan_category_type: string
  loan_type_id: number
  loan_type_name: string
  loan_type_type: string
  monthly_installments: string
  paid: number
  principal: string
  rate: string
  reason: null
  start_date: Date
  status: string
  updated_at: Date
}
