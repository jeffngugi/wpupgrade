export type TExpenseItem = {
  acc_no: string
  amount: string
  approval_stages: any[]
  approved_attempts: any[]
  approved_attempts_count: number
  attachments: string
  bank_address: string
  bank_id: string
  bank_name: string
  branch_id: number
  branch_name: string
  category: string
  city: string
  client_id: number
  code: string
  company_id: number
  country_flag: string
  country_id: number
  country_name: string
  cr: string
  created_at: string
  currency_code: string
  currency_id: number
  currency_name: string
  date_of_disbursement: any
  description: string
  dr: string
  email: any
  employee_id: number
  employee_name: string
  employee_no: string
  expense_date: string
  has_receipts: boolean
  id: number
  is_approved: number
  is_certified: number
  is_disapproved: number
  is_expense: number
  is_journal: number
  is_rejected: number
  mobile: string
  new_cr: number
  new_dr: number
  paybill_no: any
  payment_date: string
  payment_method: string
  payment_status_recovered: number
  postal_code: string
  posted_to_quick_books: number
  posted_to_wave: number
  posted_to_xero: number
  profile_picture: string
  receipts: any[]
  recipient_address: string
  recipient_email_address: string
  recipient_first_name: string
  recipient_last_name: string
  recipient_mobile_number: any
  recommendation: any
  recorded_from: string
  routing_number: string
  status: string
  status_message: any
  street_name: string
  street_number: string
  sub_category: string
  supervisor_id: any
  swift_code: string
  tax_id: number
  till_no: any
  title: string
  type: string
  updated_at: string
  with_valid_receipts: any[]
  is_imprest: boolean
}


export type ExpenseRouteInitialParams = {
  expenseStatus: { [key: string]: any };
  expenseCategory: string;
};

export type FileData = {
  name: string
  type: string
  category: string
  uri: string
  amount: number | string
}

export type Bank = {
  id: string
  name: string
  branches: BankBranch[]
}

export type TExpenseHookForm = {
  title: string
  expense_date: Date
  amount: number | string
  category: string
  currency: string | number
  payment_method: string
  bank_id: string
  acc_no: string
  recipient_number: string
  description: string
  payment_date: Date
  branch_id: string
  mMoneyProvider: string
  till_no: string
  paybill_no: string

}

export type BankBranch = {
  id: number
  name: string
  code: string

}

export type BankBranchOption = {
  value: string
  label: string
  data: BankBranch
}

// Type for payload object
export interface ExpensePayload {
  amount: number;
  expense_type: string;
  status: string;
  client_id: string | number;
  company_id: string | number;
  bank_id: string | null | number;
  branch_id: string | null | number;
  till_no: string | null | number;
  paybill_no: string | null | number;
  mobile: string;
  currency_id: string;
  country_id: string;
  acc_no: string;
  expense_date: string | null;
  payment_date: string | null;
  type: string;
  action: string;
  tax_id: number;
  recorded_from: string;
  attachments: Omit<FileData, 'amount'>[];
  previous_receipts: string;
  amounts: number[];
  is_imprest: boolean | number | string;
  dr: string | number;
}

// Type for editing payload
export interface EditExpensePayload extends ExpensePayload {
  id: number | string;
  dr: string;
  claimAmount: number;
  category: string;
}

export type TImprestAttachement = {
  id: string
  amount: string
  attachment: string
  date: string

}