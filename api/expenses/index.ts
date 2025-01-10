import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import axios from 'axios'
import { EXPENSES } from '~api/endpoints/expenses'
import { expenseQKeys } from '~api/QueryKeys'
import { getFormData } from '~utils/appUtils'

type ExpensesFetchRequestParams = {
  queryKey: any
  pageParam?: number
}

export const ExpensesFetchRequest = async ({
  queryKey,
  pageParam = 1,
}: ExpensesFetchRequestParams) => {
  const { filters } = queryKey[1]
  if (pageParam) filters.page = pageParam
  const response = await axios.get(EXPENSES.ALL, { params: filters })
  return response
}

const transformWithApprovers = item => {
  const transformData = item?.data?.data?.expenses?.data?.map(data => ({
    ...data,
    approval_stages: item?.approval_stages || [],
  }))

  return {
    ...item,
    ...item?.data,
    data: {
      ...item?.data?.data,
      expenses: { ...item?.data?.data?.expenses, data: transformData },
    },
  }
}

export const useExpensesFetchQuery = (filters: any) => {
  return useInfiniteQuery({
    queryKey: [expenseQKeys.expenses, { filters }],
    queryFn: ExpensesFetchRequest,
    getNextPageParam: (lastPage, pages) => {
      const lastPageData = lastPage?.data?.data?.expenses
      return lastPageData?.next_page_url ? lastPageData?.current_page + 1 : null
    },
  })
}

export const expenseCategoryRequest = async ({ queryKey }) => {
  const { filter } = queryKey[1]
  const response = await axios.get(EXPENSES.CATEGORIES, { params: filter })
  return response
}

export const useExpenseCategoriesFetchQuery = filter =>
  useQuery(['fetchCategories', { filter }], expenseCategoryRequest)

export const ExpenseCreate = async payload => {
  const formData = getFormData({
    ...payload,
  })

  const response = await axios.post(EXPENSES.ADD_EXPENSE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

export const useExpensesCreateMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(ExpenseCreate, {
    onSuccess: data => {
      if (data?.data?.success) {
        queryClient.invalidateQueries([expenseQKeys.expenses])
      }
    },
  })
}

export const ExpenseUpdate = async ({
  id,
  payload,
}: {
  id: string | number
  payload: any
}) => {
  const itemId = payload.id
  const formData = getFormData({
    ...payload,
  })

  const response = await axios.post(`hrm/petty-cash/${itemId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

export const useExpensesEditMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(ExpenseUpdate, {
    onSuccess: data => {
      if (data?.data?.success) {
        queryClient.invalidateQueries([expenseQKeys.expenses])
      }
    },
  })
}

export const ExpensesDelete = async payload => {
  const { id } = payload
  const response = await axios.delete(`hrm/petty-cash/${id}`, {
    params: payload,
  })
  return response
}

export const useExpensesDeleteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(ExpensesDelete, {
    onSuccess: data => {
      if (data?.data?.success) {
        queryClient.invalidateQueries([expenseQKeys.expenses])
      }
    },
  })
}

type ExpenseDetailRequestParams = {
  currency_code: string
}

//fetch payment methods
export const fetchPaymentMethods = async (
  params: ExpenseDetailRequestParams,
) => {
  const response = await axios.get('setup/payment-methods', {
    params,
  })

  return response
}

export const usePaymentMethods = (params: ExpenseDetailRequestParams) =>
  useQuery(['paymentMethods', { params }], () => fetchPaymentMethods(params))

type MobileMoneyProvidersRequestParams = {
  currency_code: string
}

//fetch mobile money providers
export const fetchMobileMoneyProviders = async ({
  currency_code,
}: MobileMoneyProvidersRequestParams) => {
  const response = await axios.get('setup/payment-methods', {
    params: { currency_code },
  })
  return response
}

export const useMobileMoneyProviders = ({
  currency_code,
}: MobileMoneyProvidersRequestParams) =>
  useQuery(['mobileMoneyProviders', { currency_code }], () =>
    fetchMobileMoneyProviders({ currency_code }),
  )

const verifyImprest = async (imprestData: {
  imprest_id: number
  reason: string
}) => {
  const { data } = await axios.post(
    'hrm/petty-cash/imprest/verification/request',
    imprestData,
  )
  return data
}

export const useVerifyImprest = () => {
  const queryClient = useQueryClient()
  return useMutation(verifyImprest, {
    onSuccess: () => {
      queryClient.invalidateQueries([expenseQKeys.expenses])
    },
  })
}

const supportingDocumentDelete = async payload => {
  const { id } = payload
  const response = await axios.post(`hrm/petty-cash/supporting-document/delete`,
    payload
  )
  return response
}

export const useSupportingDocumentDeleteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(supportingDocumentDelete, {
    onSuccess: data => {
      if (data?.data?.success) {
        queryClient.invalidateQueries([expenseQKeys.expenses])
      }
    },
  })
}