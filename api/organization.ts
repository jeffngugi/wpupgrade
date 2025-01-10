import { useQueryClient, useQuery } from '@tanstack/react-query'
import { ORGANIZATION } from '~api/endpoints/organization'
import * as API from '~services/httpClient'

export const fetchCompanies = async () => {
  const response = await API.get(ORGANIZATION)
  return response
}

export const usePrefetchCompanies = async () => {
  const queryClient = useQueryClient()
  await queryClient.prefetchQuery(['companies'])
}

export const useCompaniesV2 = params =>
  useQuery(['companiesV2', { ...params }], async ({ queryKey }) => {
    const payload = removeFalsy({
      ...defaultAuthAdminParams,
      country_id: authSwitchedCountry()?.country_id,
      ...queryKey[1],
    })
    const response = await httpV2.get('/home/companies', {
      params: {
        recordsPerPage: 200,
        ...payload,
      },
    })
    return response?.data
  })
