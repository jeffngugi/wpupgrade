import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { overtimeQKeys } from '~api/QueryKeys'
import { queryClient } from '~ClientApp'
import { TOvertimeStatus } from '~screens/overtime/types'

type OVertimeFilters = {
  status: TOvertimeStatus
}

export type TCreateOvertime = {
  date: string
  time_from: string
  notes: string
  hours: string
}

export const getOvertime = async (status: TOvertimeStatus) => {
  const { data } = await axios.get('home/paid/overtime', {
    params: {
      status,
    },
  })
  return data
}

export const getOvertimeInfinite = async ({ queryKey, pageParam = 1 }) => {
  const { filters } = queryKey[1]
  if (pageParam) filters.page = pageParam
  const { data } = await axios.get('home/paid/overtime', { params: filters })
  return data
}

export const useFetchOvertime = ({ status }: OVertimeFilters) => {
  const data = useQuery([...overtimeQKeys.overtime, status], () =>
    getOvertime(status),
  )
  return data
}

export const useFetchOvertimeInfinite = (filters: any) => {
  return useInfiniteQuery({
    queryKey: [...overtimeQKeys.overtime, { filters }],
    queryFn: getOvertimeInfinite,
    getNextPageParam: (lastPage, pages) => {
      const lastPageData = lastPage?.data
      return lastPageData?.next_page_url ? lastPageData?.current_page + 1 : null
    },
  })
}

const createOvetime = async (overtimeData: TCreateOvertime) => {
  const { data } = await axios.post('home/paid/overtime', overtimeData)
  return data
}

export const useCreateOvertime = () => {
  return useMutation<
    unknown,
    AxiosError<{ errors: string[] }>,
    TCreateOvertime
  >(createOvetime, {
    onSuccess: () => {
      queryClient.invalidateQueries(overtimeQKeys.overtime)
    },
  })
}
