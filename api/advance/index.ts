import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { advanceQKeys } from '~api/QueryKeys'
import { queryClient } from '~ClientApp'
import { TAdvanceApprovalStatus } from '~screens/overtime/types'

export type TAdanceFilter = {
  approval_status: TAdvanceApprovalStatus
}

export type TRequestAdvance = {
  amount: string
  remarks: string
  start_date: string
}

const requestAdvance = async (advanceData: TRequestAdvance) => {
  const { data } = await axios.post('hrm/salary', advanceData)
  return data
}

export const useRequestAdvance = () => {
  return useMutation<
    unknown,
    AxiosError<{ errors: string[] }>,
    TRequestAdvance
  >(requestAdvance, {
    onSuccess: () => {
      queryClient.invalidateQueries(advanceQKeys.advances)
    },
  })
}

const getAdvances = async params => {
  const { data } = await axios.get('hrm/salary', { params })
  return data
}
export const useFetchAdvances = params => {
  const data = useQuery([...advanceQKeys.advances, params], () =>
    getAdvances(params),
  )
  return data
}
export const getInfiniteAdvances = async ({ queryKey, pageParam = 1 }) => {
  const { filters } = queryKey[1]
  if (pageParam) filters.page = pageParam
  const { data } = await axios.get('hrm/salary', { params: filters })
  return data
}

export const useInfiniteAdvanceFetchQuery = (filters: any) =>
  useInfiniteQuery({
    queryKey: [...advanceQKeys.advances, { filters }],
    queryFn: getInfiniteAdvances,
    getNextPageParam: (lastPage, pages) => {
      const lastPageData = lastPage?.data
      return lastPageData?.next_page_url ? lastPageData?.current_page + 1 : null
    },
  })

export const salaryAdvanceSettings = async (params: any) => {
  const { data } = await axios.get('/home/company/salary-advance-settings', {
    params,
  })
  return data
}

export const useSalaryAdvanceSettings = (params: any) => {
  return useQuery([...advanceQKeys.advances, params], () =>
    salaryAdvanceSettings(params),
  )
}
