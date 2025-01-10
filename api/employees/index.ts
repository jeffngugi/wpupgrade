import { useQuery } from '@tanstack/react-query'
import { EMPLOYEES } from '~api/endpoints/employees'
import * as API from '~services/httpClient'

export const fetchEmployeeDetails = async ({ queryKey }) => {
  const { filter } = queryKey[1]
  const response = await API.get(EMPLOYEES.EMPLOYEE_DETAILS, filter)
  return response
}

export const useFetchEmployeeDetails = (filter, options = {}) =>
  useQuery(['employeeDetails', { filter }], fetchEmployeeDetails, {
    ...options,
  })
