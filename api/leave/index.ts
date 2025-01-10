import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { isEmpty } from 'lodash'
import { leaveQKeys } from '~api/QueryKeys'
import { queryClient } from '~ClientApp'
import useRemotePayrollEnabled from '~utils/hooks/remote-payroll-enabled'

export type TRelieverFilter = {
  searchText: string
  recordsPerPage?: number
  status?: string
  filter?: string
}

export type TLeaveDetailsFilters = {
  employee_id: string | number
  leave_type_id: string | number
  is_half_day: number
  half_day_option: string
  from: string
  to: string
}

const getLeaveBalances = async ({ filters, remoteEnabled }) => {
  const { data } = await axios.get('hrm/leavebalances', {
    params: { ...(remoteEnabled && { employee_id: filters.employeeId }) },
  })
  return data
}

const leaveBalataFormater = (response, filters) => {
  const transformData = response?.data?.data.map(item => ({
    ...item,
    leave_name: item?.employeeleaves
      ? item?.employeeleaves?.length === 1
        ? `${item?.employeeleaves?.length} leave policy`
        : `${item?.employeeleaves?.length} leave policies`
      : item?.leave_name,
    subRows: filters?.formatCheck
      ? []
      : item?.employeeleaves?.map(leave => ({
        ...leave,
        isChildRow: true,
      })),
  }))

  const requiredRows = transformData.reduce(
    (acc, item) => (acc += item?.subRows?.length),
    transformData?.length,
  )

  return {
    ...response,
    ...response.data,
    data: transformData,
    total: response?.data?.total,
    requiredRows,
  }
}

export const useLeaveBalances = filters => {
  const { remoteEnabled } = useRemotePayrollEnabled()
  const data = useQuery(
    leaveQKeys.balance,
    () => getLeaveBalances({ filters, remoteEnabled }),
    {
      select: response => leaveBalataFormater(response, filters),
    },
  )
  return data
}
type FetchLeaveQueryProps = {
  queryKey: any
  pageParam?: number
}

const LeavesRequest = async ({
  queryKey,
  pageParam = 1,
}: FetchLeaveQueryProps) => {
  const { filters } = queryKey[1]
  if (pageParam) filters.page = pageParam
  filters.sortingProperty = 'created_at'
  const { data } = await axios.get('hrm/leaves', { params: filters })
  return data
}

export const useLeavesFetchQuery = (filters: any) =>
  useInfiniteQuery({
    queryKey: ['leaves', { filters }],
    queryFn: LeavesRequest,
    getNextPageParam: (lastPage, pages) => {
      const lastPageData = lastPage?.data
      return lastPageData?.next_page_url ? lastPageData?.current_page + 1 : null
    },
  })

const deleteLeave = async (id: string): Promise<unknown> => {
  const { data } = await axios.delete(`hrm/leaves/${id}`)
  return data
}

export const useDeleteLeave = () => {
  return useMutation<unknown, AxiosError<{ errors: string[] }>, string>(
    deleteLeave,
    {
      onSuccess: () => queryClient.invalidateQueries(leaveQKeys.leaves),
    },
  )
}

const getRelievers = async (relieverFilter: TRelieverFilter) => {
  const { searchText, recordsPerPage, status } = relieverFilter
  const { data } = await axios.get('hrm/employees', {
    params: {
      as_reliever: true,
      recordsPerPage: recordsPerPage ?? 30,
      status,
      searching: !isEmpty(searchText),
      ...(!isEmpty(searchText) && { searchText: searchText }),
    },
  })
  return data
}

export const useGetRelievers = (relieverFilter: TRelieverFilter) => {
  const data = useQuery([...leaveQKeys.relievers, relieverFilter], () =>
    getRelievers(relieverFilter),
  )
  return data
}

export const createLeave = async (leaveData: unknown) => {
  const { data } = await axios.post('hrm/leaves', leaveData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
  })
  return data
}

export const useCreateLeave = () => {
  return useMutation((payload: unknown) => createLeave(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(leaveQKeys.leaves)
    },
  })
}

export const editLeave = async (payload: unknown) => {
  const { id, fdata } = payload
  const { data } = await axios.post(`hrm/leaves/${id}`, fdata, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
  })
  return data
}

export const useEditLeave = () => {
  return useMutation((payload: unknown) => editLeave(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(leaveQKeys.leaves)
    },
  })
}

const getLeaveDetails = async (filters: TLeaveDetailsFilters) => {
  const { data } = await axios.get('hrm/leave/form/details', { params: filters })
  return data
}

export const useLeaveDetailsRequest = ({ filters, leaveRequestEnabled }: { filters: TLeaveDetailsFilters, leaveRequestEnabled: boolean }) => {
  const data = useQuery(
    [leaveQKeys.leaveDetails, filters],
    () => getLeaveDetails(filters),
    {
      enabled: leaveRequestEnabled
    },
  )
  return data
}
