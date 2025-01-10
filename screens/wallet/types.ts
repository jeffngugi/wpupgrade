export interface IWalletTransactionItem {
  created_at: Date
  currency_code: string
  details: Details
  reference: null
  status: string
  total_amount: string
  type: string
  uuid: string
}

export interface Details {
  account_name: null
  account_number: string
  amount: string
  bank: null
  bank_id: null
  category_id: string
  category_name: string
  currency: string
  description: string
  fees: string
  payment_method: string
  recipient_name: null
  uuid: string
}

export interface IRecurringPayment {
  acc_name: string
  acc_no: string
  amount: number
  bank: any
  category: IRecurringPaymentCategory
  channel: string
  end_date: string
  frequency: string
  name: string
  start_date: string
  uuid: string
  currency_code: string
  next_payment_date: string
}

export interface IRecurringPaymentCategory {
  color: any
  description: string
  name: string
  uuid: string
}

export type TWithdrawResponse = {
  account_name: string
  account_number: string
  amount: string
  bank?: string | null
  bank_id?: string | null
  category_id: string
  category_name: string
  currency: string
  description?: string | null
  fees: string
  internal_reference: string
  payment_method: string
  payment_method_name: string
  recipient_name: string
  status_message: null
  uuid: string
}
