import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import axios from 'axios'
import { LOANS } from '~api/endpoints/loans'
import { getFormData } from '~utils/appUtils'

type LoansFetchRequestParams = {
  queryKey: any
  pageParam?: number
}

export const LoansFetchRequest = async ({
  queryKey,
  pageParam = 1,
}: LoansFetchRequestParams) => {
  const { filters } = queryKey[1]
  if (pageParam) filters.page = pageParam
  const response = await axios.get(LOANS.LOANS, { params: filters })
  return response
}

const transformWithApprovers = (item: {
  data: { data: { data: any[] }; approval_stages: any }
}) => {
  const transformData = item?.data?.data?.data?.map((data: any) => ({
    ...data,
    approval_stages: item?.data?.approval_stages || [],
  }))

  return {
    ...item,
    ...item?.data,
    data: {
      ...item?.data?.data,
      data: { ...item?.data?.data, data: transformData },
    },
  }
}

export const useLoansFetchQuery = (filters: any) =>
  useInfiniteQuery({
    queryKey: ['loans', { filters }],
    queryFn: LoansFetchRequest,
    getNextPageParam: (lastPage, pages) => {
      const lastPageData = lastPage?.data?.data
      return lastPageData?.last_page > lastPageData.current_page
        ? lastPageData?.current_page + 1
        : null
    },
  })

export const LoanCategoriesFetchRequest = async ({ queryKey }) => {
  const { filters } = queryKey[1]
  const response = await axios.get(LOANS.LOAN_CATEGORIES, { params: filters })
  return response
}

export const useLoanCategoriesFetchQuery = (filters: object) =>
  useQuery(['loanCategories', { filters }], LoanCategoriesFetchRequest)

export const getLoanDetail = async detailParams => {
  const { data } = await axios.get('hrm/loans/form/details', {
    params: detailParams,
  })
  return data
}

export const useGetLoanDetail = detailParams => {
  const data = useQuery(['loan-details'], () => getLoanDetail(detailParams))
  return data
}

export const LoanIssueRequest = async (params: {
  payload: any
  isWorkpayFunded: boolean
}) => {
  const { payload, isWorkpayFunded } = params
  const formData = getFormData({
    ...payload,
  })
  const url = isWorkpayFunded ? LOANS.WP_LOANS : LOANS.LOANS
  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

export const useLoanIssueMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(LoanIssueRequest, {
    onSuccess: data => {
      const { success } = data?.data
      if (success) {
        queryClient.invalidateQueries(['loans'])
      }
    },
  })
}

export const getLoanType = async () => {
  const { data } = await axios.get('hrm/loans/settings')
  return data
}

export const useGetLoanType = () => {
  const data = useQuery(['loan-type'], () => getLoanType())
  return data
}

export const getWPLoanCategories = async (filters: { currency_id: number }) => {
  const { data } = await axios.get('hrm/wp/loans/categories', {
    params: filters,
  })
  return data
}

export const useGetWPLoanCategories = (filters: { currency_id: number }) => {
  const data = useQuery(['wp-loan-category'], () =>
    getWPLoanCategories(filters),
  )
  return data
}

export const getLoanAmortizationAmortization = async (id: string | number) => {
  const { data } = await axios.get(`hrm/loans/${id}`)
  return data
}

export const useGetLoanDetailAmortization = (id: string | number) => {
  const data = useQuery(['loan-detail-amortization', id], () =>
    getLoanAmortizationAmortization(id),
  )
  return data
}
