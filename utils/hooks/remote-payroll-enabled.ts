import { useQueryClient } from '@tanstack/react-query'
import { settingQKeys } from '~api/QueryKeys'

export default function useRemotePayrollEnabled() {
  const queryClient = useQueryClient()
  const queryInfo = queryClient.getQueryData(settingQKeys.account)
  const settings = queryInfo?.data
  const remoteEnabled = Number(settings?.eor_enabled) === 1
  return { remoteEnabled, status: queryInfo?.status }
}
