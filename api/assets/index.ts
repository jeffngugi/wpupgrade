import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { assetQKeys } from '~api/QueryKeys'
import { State } from '~declarations'

const getAssets = async (params: {
  employee_id: string | number
  group_by: string
  status: string
}) => {
  const { data } = await axios.get('hrm/hrmassets', { params })
  return data
}

export const useGetAssets = () => {
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)

  const params = {
    employee_id,
    group_by: 'EMPLOYEE',
    status: 'ASSIGNED',
  }
  const data = useQuery(assetQKeys.assets, () => getAssets(params))
  return data
}
