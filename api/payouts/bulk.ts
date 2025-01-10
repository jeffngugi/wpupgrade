import * as API from '~services/httpClient'
import { PAYOUTS } from '~api/endpoints/payouts'
import { useQuery } from '@tanstack/react-query'

export const fetchPaypoints = async ({ queryKey }) => {
  const [_, filters] = queryKey
  const response = await API.get(PAYOUTS.GET_PAYOUTS, {
    recordsPerPage: 500,
    ...filters,
  })
  return response
}

const transformPaypoints = item => ({
  ...item,
  ...item.data,
})

export const usePaypoints = filters =>
  useQuery(['paypoints', { ...filters }], fetchPaypoints, {
    select: transformPaypoints,
    onError: error => {
      console.log(error)
    },
  })
