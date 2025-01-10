import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { payslipQKeys } from '~api/QueryKeys'
import { State } from '~declarations'
import { pdfDownloader } from '~utils/downloader'

type FetchPayslipQueryProps = {
  queryKey: any
  pageParam?: number
}

const getPayslips = async ({
  queryKey,
  pageParam = 1,
}: FetchPayslipQueryProps) => {
  const { filters } = queryKey[1]
  if (pageParam) filters.page = pageParam
  const { data } = await axios.get('hrm/payslips', { params: filters })
  return data
}

export const useGetPayslipsInfinite = (filters: any) => {
  return useInfiniteQuery({
    queryKey: [...payslipQKeys.payslips, { filters }],
    queryFn: getPayslips,
    getNextPageParam: (lastPage, pages) => {
      const lastPageData = lastPage?.data
      return lastPageData?.next_page_url ? lastPageData?.current_page + 1 : null
    },
  })
}

const payrollBatches = async () => {
  const { data } = await axios.get('hrm/payroll-batches')
  return data
}

export const usePayrollBatches = () => {
  const data = useQuery([...payslipQKeys.payslips], payrollBatches)
  return data
}

const getPayslip = async (
  id: string | number,
  token: string,
  access_local_payslips: boolean,
) => {
  const { data } = await axios.get(`hrm/payslip/${id}`, {
    params: {
      token: `Bearer ${token}`,
      access_local_payslips: access_local_payslips,
    },
  })

  return data
}

export const useGetPayslip = (
  id: string | number,
  access_local_payslips: boolean,
) => {
  const {
    user: { token },
  } = useSelector((state: State) => state.user)

  const data = useQuery([payslipQKeys.payslip, id], () =>
    getPayslip(id, token, access_local_payslips),
  )
  return data
}

const downLoadPayslip = async (encodedId: string, token: string) => {
  const { data } = await axios.get(`hrm/download/${encodedId}/payslip`, {
    params: {
      token: `Bearer ${token}`,
      access_local_payslips: true,
    },
  })
  return data
}

export const useDownloadPayslip = () => {
  const {
    user: { token },
  } = useSelector((state: State) => state.user)

  const { environments, current } = useSelector(
    (state: State) => state.environments,
  )
  const url = environments[current].replace('/api/v2/', '')
  return useMutation((encodedId: string) => downLoadPayslip(encodedId, token), {
    onSuccess: data => {
      const pdf_url = url + data?.data?.file_path
      const pdfUrlChunks = data?.data?.file_path?.split('.')
      const pdfNameChunks = pdfUrlChunks[0].split('/')
      pdfDownloader(pdf_url, pdfNameChunks[3])
    },
  })
}

export type TemailPayslipReq = {
  month: string
  year: string
  employee_id: string
}

export const emailPayslip = async (
  payload: TemailPayslipReq,
  params: {
    auth_employee_id: string | number
    authorize_for: string
    auth_company_id: string | number
    token: string
  },
) => {
  const submitData = { ...payload, auth_company_id: params.auth_company_id }

  const response = await axios.post('templating/payslip/email', submitData, {
    params,
  })

  return response.data
}

export const useEmailPayslip = () => {
  const {
    user: { token, company_id, employee_id },
  } = useSelector((state: State) => state.user)

  const params = {
    auth_employee_id: employee_id,
    authorize_for: 'employee',
    auth_company_id: company_id,
    id: undefined,
    token,
  }

  return useMutation((payload: TemailPayslipReq) =>
    emailPayslip(payload, params),
  )
}
