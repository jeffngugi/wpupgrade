import { useGetWalletUser } from '~api/wallet'

export type TWalletAccount = {
  acc_no: string
  balance: string
  currency: string
  last_update: Date
  type: string
  uuid: string
}

export function useWalletStatus() {
  const { data, isLoading, isFetched } = useGetWalletUser()

  const isActive = data?.data?.status === 'ACTIVE'

  const user_uuid = data?.data?.uuid
  const wallet_uuid = data?.data?.uuid
  const wallet = data?.data?.wallets?.filter(
    wallet => wallet?.type === 'CHECKING',
  )?.[0]
  const wallet_account: TWalletAccount = data?.data?.wallets?.[0]
  return {
    data,
    isLoading,
    user_uuid,
    isFetched,
    wallet_account,
    wallet,
    wallet_uuid,
    isActive,
    next_step: parseInt(data?.data?.next_step),
  }
}
