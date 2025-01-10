import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { isEmpty } from 'lodash'
import { useSelector } from 'react-redux'
import { queryClient } from '~ClientApp'
import { userQKeys, walletQKeys } from '~api/QueryKeys'
import { State } from '~declarations'

export const optInWallet = async (createData: any) => {
  const { data } = await axios.post('wallet-api/user/opt-in', createData)
  return data
}

export const useOptInWallet = () => {
  return useMutation((payload: unknown) => optInWallet(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.transactions)
    },
  })
}

const optOutWallet = async (createData: any) => {
  const { data } = await axios.post('wallet-api/user/opt-out', createData)
  return data
}

export const useOptOutWallet = () => {
  return useMutation((payload: unknown) => optOutWallet(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([walletQKeys.user])
    },
  })
}

const getOptOutReasons = async () => {
  const { data } = await axios.get('wallet-api/opt-out-reasons')
  return data
}

export const useGetOptOutReasons = () => {
  const data = useQuery(walletQKeys.optOutReasons, getOptOutReasons)
  return data
}

const getSecurityQuestions = async () => {
  const { data } = await axios.get('wallet-api/security-questions')
  return data
}

export const useGetSecurityQuestions = () => {
  const data = useQuery(walletQKeys.questions, getSecurityQuestions)
  return data
}

const getTransferCategories = async (uuid: string) => {
  const { data } = await axios.get(
    `wallet-api/transaction-categories?user_uuid=${uuid}`,
  )
  return data
}

export const useGetTransferCategories = () => {
  const { data: walletData } = useGetWalletUser()
  const uuid = walletData.data.uuid
  const data = useQuery(walletQKeys.categories, () =>
    getTransferCategories(uuid),
  )
  return data
}

const getWalletUser = async (employee_id: string | number) => {
  const { data } = await axios.get(`wallet-api/user/${employee_id}`)
  return data
}

export const useGetWalletUser = () => {
  const { user } = useSelector((state: State) => state.user)
  const { employee_id } = user
  const data = useQuery([walletQKeys.user], () => getWalletUser(employee_id))
  return data
}

export const uploadProfilePic = async (profileData: unknown) => {
  const { data } = await axios.post(
    'wallet-api/user/update-profile',
    profileData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    },
  )
  return data
}

export const useUploadProfilePicWallet = () => {
  return useMutation((payload: unknown) => uploadProfilePic(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([walletQKeys.user])
    },
  })
}

export const securityQuestions = async (createData: any) => {
  const { data } = await axios.post(
    'wallet-api/security-questions-answers',
    createData,
  )
  return data
}

export const useSecurityQuestions = () => {
  return useMutation((payload: unknown) => securityQuestions(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([walletQKeys.user])
    },
  })
}

export const updateWalletUser = async (createData: any) => {
  const { data } = await axios.post('wallet-api/user/update', createData)
  return data
}

export const useUpdateWalletUser = () => {
  return useMutation((payload: unknown) => updateWalletUser(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([walletQKeys.user])
    },
  })
}

export const createWalletPin = async (createData: any) => {
  const { data } = await axios.post('wallet-api/user/create-pin', createData)
  return data
}

export const useCreateWalletPin = () => {
  return useMutation((payload: unknown) => createWalletPin(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([walletQKeys.user])
    },
  })
}

export const fundWallet = async (createData: any) => {
  const { data } = await axios.post('wallet-api/fund/request', createData)
  return data
}

export const useFundWallet = () => {
  return useMutation((payload: unknown) => fundWallet(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.transactions)
      queryClient.invalidateQueries([walletQKeys.user])
    },
  })
}

export const fundWalletBank = async (createData: any) => {
  const { data } = await axios.post('wallet-api/fund/request', createData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export const useFundWalletBank = () => {
  return useMutation((payload: unknown) => fundWalletBank(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.transactions)
      queryClient.invalidateQueries([walletQKeys.user])
    },
  })
}

export const walletTransfer = async (createData: any) => {
  const { data } = await axios.post('wallet-api/transfer', createData)
  return data
}

export const useWalletTransfer = () => {
  return useMutation((payload: unknown) => walletTransfer(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.transactions)
      queryClient.invalidateQueries([walletQKeys.user])
    },
  })
}

export const recipientName = async (createData: any) => {
  const data = await axios.post(
    'wallet-api/transfer/recipient-name',
    createData,
  )
  return data?.data
}

export const useRecipientName = () => {
  return useMutation((payload: unknown) => recipientName(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.transactions)
    },
  })
}

export const transferPin = async (createData: any) => {
  const { data } = await axios.post(
    'wallet-api/transfer/verify-pin',
    createData,
  )
  return data
}

export const useTransferPin = () => {
  return useMutation((payload: unknown) => transferPin(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.transactions)
      queryClient.invalidateQueries([walletQKeys.user])
    },
  })
}

export const changeWalletPin = async (createData: any) => {
  const { data } = await axios.post(
    'wallet-api/user/reset-password',
    createData,
  )
  return data
}

export const useChangeWalletPin = () => {
  return useMutation((payload: unknown) => changeWalletPin(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.transactions)
    },
  })
}

export const walletBeneficiary = async (createData: any) => {
  const { data } = await axios.post('wallet-api/beneficiaries', createData)
  return data
}

export const useCreateWalletBeneficiary = () => {
  return useMutation((payload: unknown) => walletBeneficiary(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.beneficiaries)
      queryClient.invalidateQueries(walletQKeys.linkedAcc)
    },
  })
}

export const editWalletBeneficiary = async (createData: any) => {
  const { data } = await axios.post(
    'wallet-api/beneficiaries/update',
    createData,
  )
  return data
}

export const useEditWalletBeneficiary = () => {
  return useMutation((payload: unknown) => editWalletBeneficiary(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.linkedAcc)
    },
  })
}
const getLinkedAccounts = async (uuid: string) => {
  const { data } = await axios.get(`wallet-api/user/linked-acc/${uuid}`)
  return data
}

export const useGetLinkedAccounts = () => {
  const { data: walletData } = useGetWalletUser()
  const uuid = walletData.data.uuid
  const data = useQuery(walletQKeys.linkedAcc, () => getLinkedAccounts(uuid))
  return data
}

const getBeneficiaries = async (
  uuid: string,
  params: { searchText: string; channel?: 'WALLET' | 'BANK_TRANSFER' | 'ALL' },
) => {
  const { searchText, channel } = params
  const { data } = await axios.get(`wallet-api/user/beneficiaries/${uuid}`, {
    params: {
      ...(!isEmpty(searchText) && { searchText: searchText }),
      ...(!isEmpty(channel) && { channel }),
    },
  })
  return data
}

export const useGetBeneficiaries = (params: { searchText: string }) => {
  const { data: walletData } = useGetWalletUser()
  const uuid = walletData.data.uuid
  const data = useQuery([...walletQKeys.beneficiaries, params], () =>
    getBeneficiaries(uuid, params),
  )
  return data
}

const getTransactions = async (params: unknown) => {
  const { data } = await axios.get('wallet-api/transactions', {
    params,
  })
  return data
}

export const useGetWalletTransactions = (walletParams: unknown) => {
  const data = useQuery([...walletQKeys.transactions, walletParams], () =>
    getTransactions(walletParams),
  )
  return data
}

type TransactionRequestProps = {
  queryKey: any
  pageParam?: number
}

const TransactionRequest = async ({
  queryKey,
  pageParam = 1,
}: TransactionRequestProps) => {
  const { filters } = queryKey[1]
  if (pageParam) filters.page = pageParam
  const { data } = await axios.get('wallet-api/transactions', {
    params: filters,
  })
  return data
}

export const useWalletTransactionsFetchQuery = (filters: any) =>
  useInfiniteQuery({
    queryKey: [walletQKeys.transactions, { filters }],
    queryFn: TransactionRequest,
    getNextPageParam: (lastPage, pages) => {
      const lastPageData = lastPage?.data?.meta
      if (lastPageData?.current_page < lastPageData?.last_page) {
        return lastPageData?.current_page + 1;
      } else {
        return null; // No more pages to fetch
      }
    },
  })

const updateNotificationSettings = async (createData: any) => {
  const { data } = await axios.post(
    'wallet-api/user/settings/update',
    createData,
  )
  return data
}
export const createRecurringTransfer = async (createData: any) => {
  const { data } = await axios.post(
    'wallet-api/recurring-transfers',
    createData,
  )
  return data
}

export const useUpdateNotificationSettingsMutation = () => {
  return useMutation(
    (payload: unknown) => updateNotificationSettings(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(walletQKeys.notificationSettings)
      },
    },
  )
}

const getNotificationSettings = async (user_uuid: string) => {
  const { data } = await axios.get(`wallet-api/user/settings/${user_uuid}`)
  return data
}

export const useGetNotificationSettings = (user_uuid: string) => {
  const data = useQuery(walletQKeys.notificationSettings, () =>
    getNotificationSettings(user_uuid),
  )
  return data
}
export const useCreateRecurringTransfer = () => {
  return useMutation((payload: unknown) => createRecurringTransfer(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.recurring)
    },
  })
}

const getRecurringTransfers = async (user_uuid: string) => {
  const { data } = await axios.get(
    `wallet-api/recurring-transfers/${user_uuid}`,
  )
  return data
}

export const useGetWalletRecurring = () => {
  const { data: walletData } = useGetWalletUser()
  const user_uuid = walletData?.data?.uuid
  const data = useQuery([...walletQKeys.recurring], () =>
    getRecurringTransfers(user_uuid),
  )
  return data
}

export const verifyCardTransaction = async (params: any) => {
  const { data } = await axios.post('wallet-api/fund/verify', {}, { params })

  return data
}

export const useVerifyCardTransaction = () => {
  return useMutation((params: unknown) => verifyCardTransaction(params), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.user)
      queryClient.invalidateQueries(walletQKeys.transactions)
    },
  })
}

const fetchTransactionCategories = async (user_uuid: string) => {
  const { data } = await axios.get('wallet-api/transaction-categories', {
    params: { user_uuid },
  })
  return data
}

export const useTransactionCategories = ({
  user_uuid,
}: {
  user_uuid: string
}) => {
  const data = useQuery(walletQKeys.transactionCategories, () =>
    fetchTransactionCategories(user_uuid),
  )
  return data
}

const createTransactionCategory = async (createData: any) => {
  const { data } = await axios.post(
    'wallet-api/transaction-categories',
    createData,
  )
  return data
}

export const useCreateTransactionCategory = () => {
  return useMutation((payload: unknown) => createTransactionCategory(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.transactionCategories)
    },
  })
}

const updateTransactionCategory = async (createData: any) => {
  const { data } = await axios.post(
    'wallet-api/transaction-categories/update',
    createData,
  )
  return data
}

export const useUpdateTransactionCategory = () => {
  return useMutation((payload: unknown) => updateTransactionCategory(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.transactionCategories)
    },
  })
}

const deleteTransactionCategory = async (id: string) => {
  const { data } = await axios.post(
    `wallet-api/transaction-categories/delete/${id}`,
  )
  return data
}

export const useDeleteTransactionCategory = () => {
  return useMutation((id: string) => deleteTransactionCategory(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.transactionCategories)
    },
  })
}

const updateWalletProfile = async (createData: any) => {
  const { data } = await axios.post(
    'wallet-api/user/update-profile',
    createData,
  )
  return data
}

export const useUpdateWalletProfile = () => {
  return useMutation((payload: unknown) => updateWalletProfile(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([walletQKeys.user])
    },
  })
}

const send2FactorAuthOTP = async (createData: any) => {
  const { data } = await axios.post(
    'wallet-api/user/settings/send-otp',
    createData,
  )
  return data
}

export const useSend2FactorAuthOTP = () => {
  return useMutation((payload: unknown) => send2FactorAuthOTP(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([walletQKeys.user])
    },
  })
}

const confirmOTP = async (createData: any) => {
  const { data } = await axios.post(
    'wallet-api/user/settings/enable/sms-2fa',
    createData,
  )
  return data
}

export const useConfirmOTP = () => {
  return useMutation((payload: unknown) => confirmOTP(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([walletQKeys.user])
      queryClient.invalidateQueries(walletQKeys.notificationSettings)
    },
  })
}

const addSecurityQuestionsAnswer = async (createData: any) => {
  const { data } = await axios.post(
    'wallet-api/user/settings/security-questions',
    createData,
  )
  return data
}

export const useAddSecurityQuestionsAnswer = () => {
  return useMutation(
    (payload: unknown) => addSecurityQuestionsAnswer(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(walletQKeys.notificationSettings)
      },
    },
  )
}

const disable2FASecurity = async (createData: any) => {
  const { data } = await axios.post(
    'wallet-api/user/settings/disable-2fa',
    createData,
  )
  return data
}

export const useDisable2FASecurity = () => {
  return useMutation((payload: unknown) => disable2FASecurity(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.notificationSettings)
    },
  })
}

const update2FASecurityQuestion = async (createData: any) => {
  const { data } = await axios.post(
    'wallet-api/security-questions-answers',
    createData,
  )
  return data
}

export const useUpdate2FASecurityQuestion = () => {
  return useMutation((payload: unknown) => update2FASecurityQuestion(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([walletQKeys.user])
    },
  })
}

const deleteRecurringPayment = async (id: string) => {
  const { data } = await axios.post(
    `wallet-api/recurring-transfers/delete/${id}`,
  )
  return data
}

export const useDeleteRecurringPayment = () => {
  return useMutation(deleteRecurringPayment, {
    onSuccess: () => queryClient.invalidateQueries(walletQKeys.recurring),
  })
}

export const makeWithdrawal = async (createData: any) => {
  const { data } = await axios.post('wallet-api/withdrawal', createData)
  return data
}

export const useMakeWithdrawal = () => {
  return useMutation((payload: unknown) => makeWithdrawal(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.transactions)
    },
  })
}

export const withdrawPin = async (createData: any) => {
  const { data } = await axios.post(
    'wallet-api/withdrawal/verify-pin',
    createData,
  )
  return data
}

export const useWithdrawPin = () => {
  return useMutation((payload: unknown) => withdrawPin(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.transactions)
      queryClient.invalidateQueries([walletQKeys.user])
    },
  })
}

export const enableWalletPayment = async () => {
  const { data } = await axios.get('wallet-api/user/enable-salary-payment')
  return data
}

export const useEnableWalletPayment = () => {
  return useMutation(enableWalletPayment, {
    onSuccess: () => {
      queryClient.invalidateQueries([walletQKeys.user])
      queryClient.invalidateQueries(userQKeys.myprofile)
    },
  })
}

const disableWalletPayment = async () => {
  const { data } = await axios.get('wallet-api/user/disable-salary-payment')
  return data
}

export const useDisableWalletPayment = () => {
  return useMutation(disableWalletPayment, {
    onSuccess: () => queryClient.invalidateQueries([walletQKeys.user]),
  })
}

const deleteBeneficiary = async (id: string) => {
  const { data } = await axios.post(`wallet-api/beneficiaries/delete/${id}`)
  return data
}

export const useDeleteBeneficiary = () => {
  return useMutation((id: string) => deleteBeneficiary(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.beneficiaries)
      queryClient.invalidateQueries(walletQKeys.linkedAcc)
    },
  })
}

export const pollMpesaPayment = async ({
  reference,
}: {
  reference: string
}) => {
  const { data } = await axios.get(`wallet-api/fund/poll-status/${reference}`)
  return data
}

export const usePollMpesaPayment = () => {
  return useMutation(pollMpesaPayment, {
    onSuccess: () => {
      queryClient.invalidateQueries(walletQKeys.transactions)
      queryClient.invalidateQueries([walletQKeys.user])
    },
  })
}

export const pollverifyMpesaPayment = async payload => {
  const { data } = await axios.post('wallet-api/fund/verify-mpesa', payload)
  return data
}

export const usePollVerifyMpesaPayment = () => {
  return useMutation(pollverifyMpesaPayment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['my-wallet-transactions'])
      queryClient.invalidateQueries(['walletStatus'])
    },
  })
}

const exportWalletStatement = async (payload: unknown) => {
  const { data } = await axios.get('wallet-api/transactions/statement', {
    params: payload,
  })

  return data
}

export const useExportWalletStatement = () => {
  return useMutation(params => exportWalletStatement(params))
}
