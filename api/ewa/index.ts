import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useSelector } from 'react-redux'
import { queryClient } from '~ClientApp'
import { ewaQKeys } from '~api/QueryKeys'
import { State } from '~declarations'
import {
  TBeneficiary,
  TCompleteEwaWithdrawal,
  TConfirmOtp,
  TEwaSubmitData,
  TResendOtp,
} from '~types'

type getEwaTransactionsProps = {
  queryKey: any
  pageParam?: number
}

const getEwaTransactions = async ({
  queryKey,
  pageParam = 1,
}: getEwaTransactionsProps) => {
  const { filters } = queryKey[1]
  if (pageParam) filters.page = pageParam
  const { data } = await axios.get('hrm/salary_financed_by/transactions', {
    params: filters,
  })
  return data
}

export const useEwaTransctions = (filters: any) => {
  return useInfiniteQuery({
    queryKey: [ewaQKeys.trasactions, { filters }],
    queryFn: getEwaTransactions,
    getNextPageParam: (lastPage, pages) => {
      const lastPageData = lastPage?.data
      return lastPageData?.next_page_url ? lastPageData?.current_page + 1 : null
    },
  })
}

const getBanks = async params => {
  const { data } = await axios.get('setup/paypoints', { params })
  return data
}

export const useGetBanks = params => {
  const data = useQuery(ewaQKeys.banks, () => getBanks(params))
  return data
}

const getEwaBeneficiaries = async (params: {
  for_employee_id: string | number
  selfservice: number
}) => {
  const { data } = await axios.get('hrm/beneficiaries', {
    params,
  })
  return data
}

export const useEwaBeneficiaries = () => {
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)
  const params = {
    for_employee_id: employee_id,
    selfservice: 1,
  }
  const data = useQuery(ewaQKeys.beneficiaries, () =>
    getEwaBeneficiaries(params),
  )
  return data
}

const getEwaEarnings = async (employee_id: string | number) => {
  const { data } = await axios.get(
    'hrm/employee/salary_financed_by/earnings/summary',
    { params: { employee_id } },
  )
  return data
}

export const useEwaEarning = () => {
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)
  const data = useQuery(ewaQKeys.earnings, () => getEwaEarnings(employee_id))
  return data
}

const ewaCharges = async (chargesData: TEwaSubmitData) => {
  const { data } = await axios.post('home/transaction-fees', chargesData)
  return data
}

export const useEwaCharges = () => {
  return useMutation<unknown, AxiosError<{ errors: string[] }>, TEwaSubmitData>(
    ewaCharges,
  )
}

const applyEwa = async (chargesData: TEwaSubmitData) => {
  const { data } = await axios.post('hrm/salary_financed_by', chargesData)
  return data
}

export const useApplyEWA = () => {
  return useMutation<unknown, AxiosError<{ errors: string[] }>, TEwaSubmitData>(
    applyEwa,
  )
}

const resendOtp = async (resendOtpData: TResendOtp) => {
  const cacheId = resendOtpData.cacheId
  const amount = resendOtpData.recipient_item_id
  const params = { recipient_item_id: resendOtpData.recipient_item_id }
  const { data } = await axios.post(
    `payout/pin/${cacheId}/${amount}/pin/resend`,
    params,
  )
  return data
}

export const useResendOtp = () => {
  return useMutation<unknown, AxiosError<{ errors: string[] }>, TResendOtp>(
    resendOtp,
  )
}

const confirmOtp = async (confirmData: TConfirmOtp) => {
  const payload = {
    payment_cache_id: confirmData.payment_cache_id,
    pin: confirmData.pin,
  }
  const { data } = await axios.post('payout/pin/verify', payload)
  return data
}

export const useConfirmOtp = () => {
  return useMutation<unknown, AxiosError<{ errors: string[] }>, TConfirmOtp>(
    confirmOtp,
  )
}

const completeEwaWithdrawal = async (completeData: TCompleteEwaWithdrawal) => {
  const { data } = await axios.post(
    'hrm/salary_financed_by/payout',
    completeData,
  )
  return data
}

export const useCompleteEwaWithdrawal = () => {
  return useMutation<
    unknown,
    AxiosError<{ errors: string[] }>,
    TCompleteEwaWithdrawal
  >(completeEwaWithdrawal)
}

const createBeneficiary = async (beneficiary: TBeneficiary) => {
  const { data } = await axios.post('hrm/beneficiaries', beneficiary)
  return data
}

export const useCreateBeneficiary = () => {
  return useMutation<unknown, AxiosError<{ errors: string[] }>, TBeneficiary>(
    createBeneficiary,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(ewaQKeys.beneficiaries)
      },
    },
  )
}
