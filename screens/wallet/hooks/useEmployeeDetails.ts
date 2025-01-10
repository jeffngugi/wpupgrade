import { useSelector } from 'react-redux'
import { useFetchEmployeeDetails } from '~api/employees'
import { State } from '~declarations'

export function useEMployeeDetails() {
  const {
    user: { employee_id: employeeID, company_id: companyID },
  } = useSelector((state: State) => state.user)

  const employeeDetails = useFetchEmployeeDetails({
    id: String(employeeID),
  })

  return {
    data: employeeDetails?.data?.data?.data,
    countryOfResidence: employeeDetails?.data?.data?.data?.country,
    isLoading: employeeDetails?.isLoading,
  }
}
