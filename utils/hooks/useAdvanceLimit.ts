import { useMyProfile } from '~api/account'
import { useAccountSettings } from '~api/settings'

export function useAdvanceLimit(): {
  advanceLimit: number | string
} {
  let advanceLimit: string | number = '-'
  const { data } = useAccountSettings()
  const { data: profileData } = useMyProfile()
  const limitType = data?.data?.salary_advance_employee_limit_type
  const limit = data?.data.salary_advance_employee_limit
  const employeeSalary = profileData?.data?.salary
  if (limitType === 'percent') {
    try {
      const myAdvance = Number(limit) * Number(employeeSalary) * 0.01
      advanceLimit = myAdvance.toLocaleString() ?? '-'
    } catch (error) {
      advanceLimit = '-'
    }
  } else {
    advanceLimit = limit ?? '-'
  }
  return { advanceLimit }
}
