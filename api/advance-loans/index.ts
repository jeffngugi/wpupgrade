import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import _ from 'lodash'
import { advanceLoanQkeys } from '~api/QueryKeys'
import { queryClient } from '~ClientApp'
import { LoanDetailParams } from '~screens/advance-workpay/LoanReview'
import { TAdvanceApprovalStatus } from '~screens/overtime/types'
import { getFormData } from '~utils/appUtils'

export type TAdanceFilter = {
  approval_status: TAdvanceApprovalStatus
}

export type TRequestAdvance = {
  principal: string
  reason: string
  start_date: string
  no_of_months: string
  employee_ids: []
  financial_statement?: File
  proof_of_residence?: File
}

const requestAdvanceLoan = async (advanceData: TRequestAdvance) => {
  const formData = getFormData({
    ...(_.omit(advanceData, 'id') as any),
  })

  const { data } = await axios.post('hrm/salary_advance_loans', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export const useRequestAdvanceLoan = () => {
  return useMutation<
    unknown,
    AxiosError<{ errors: string[] }>,
    TRequestAdvance
  >(requestAdvanceLoan, {
    onSuccess: () => {
      queryClient.invalidateQueries(advanceLoanQkeys.advances)
    },
  })
}

//create a type for below params coming from useInfiniteQuery copilot

export const getInfiniteAdvances = async ({ queryKey, pageParam = 1 }) => {
  const { filters } = queryKey[1]
  if (pageParam) filters.page = pageParam
  const { data } = await axios.get('hrm/salary_advance_loans', {
    params: filters,
  })
  return data
}

export const useInfiniteAdvanceLoansFetchQuery = (filters: any) =>
  useInfiniteQuery({
    queryKey: [...advanceLoanQkeys.advances, { filters }],
    queryFn: getInfiniteAdvances,
    getNextPageParam: (lastPage, pages) => {
      const lastPageData = lastPage?.data
      return lastPageData?.next_page_url ? lastPageData?.current_page + 1 : null
    },
  })

interface salaryAdvanceLoanSettingsParams {
  type: string
}

export const salaryAdvanceLoanSettings = async (
  params?: salaryAdvanceLoanSettingsParams,
) => {
  const { data } = await axios.get('companies-salary-advances', {
    params,
  })
  return data
}

export const useSalaryAdvanceLoanSettings = (
  params?: salaryAdvanceLoanSettingsParams,
) => {
  return useQuery([...advanceLoanQkeys.advances, params], () =>
    salaryAdvanceLoanSettings(params),
  )
}

export const getAdvanceLoanDetail = async (detailParams: LoanDetailParams) => {
  const { data } = await axios.get('hrm/salary_advance_loans/form/details', {
    params: detailParams,
  })
  return data
}

export const useGetAdvanceLoanDetail = (detailParams: LoanDetailParams) => {
  const data = useQuery(
    ['loan-details'],
    () => getAdvanceLoanDetail(detailParams),
    {
      enabled: !!detailParams.currency_id,
    },
  )
  return data
}

export const getAdvanceLoanLimit = async () => {
  const { data } = await axios.get('hrm/salary_advance_loans/employee_limit')

  return data
}

export const useGetAdvanceLoanLimit = () => {
  const data = useQuery([advanceLoanQkeys.advances, 'loan-limit'], () =>
    getAdvanceLoanLimit(),
  )
  return data
}

const deleteAdvanceLoan = async (id: string) => {
  const { data } = await axios.delete(`hrm/salary_advance_loans/${id}`)
  return data
}

export const useDeleteAdvanceLoan = () => {
  return useMutation(deleteAdvanceLoan, {
    onSuccess: () => {
      queryClient.invalidateQueries(advanceLoanQkeys.advances)
    },
  })
}

export const AdvanceLoanUpdate = async ({
  id,
  payload,
}: {
  id: string | number
  payload: any
}) => {
  const itemId = payload.id
  const formData = getFormData({
    ...(_.omit(payload, 'id') as any),
  })

  const response = await axios.post(
    `hrm/salary_advance_loans/${itemId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return response
}

export const useAdvanceLoanEditMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(AdvanceLoanUpdate, {
    onSuccess: data => {
      if (data?.data?.success) {
        queryClient.invalidateQueries(advanceLoanQkeys.advances)
      }
    },
  })
}
