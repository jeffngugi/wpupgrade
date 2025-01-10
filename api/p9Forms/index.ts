import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { payslipQKeys } from '~api/QueryKeys'
import { State } from '~declarations'
import { pdfDownloader } from '~utils/downloader'

export const generateP9Form = async ({ queryKey }: { queryKey: any }) => {
  const { filters } = queryKey[1]
  const response = await axios.get('home/list/p9/forms', { params: filters })
  return response
}

export const useGetP9FormsInfinite = (filters: any) => {
  return useInfiniteQuery({
    queryKey: [...payslipQKeys.p9Forms, { filters }],
    queryFn: () =>
      generateP9Form({ queryKey: [...payslipQKeys.p9Forms, { filters }] }),
    getNextPageParam: (lastPage, pages) => {
      const lastPageData = lastPage?.data?.data
      return lastPageData?.next_page_url ? lastPageData?.current_page + 1 : null
    },
    enabled: !_.isEmpty(filters),
    retry: false,
  })
}

const payrollBatches = async () => {
  const { data } = await axios.get('hrm/payroll-batches')
  return data
}

export const usePayrollBatches = () => {
  const data = useQuery([...payslipQKeys.p9Forms], payrollBatches)
  return data
}

const getPayslip = async (id: string | number, token: string) => {
  const { data } = await axios.get(`hrm/payslip/${id}`, {
    params: {
      token: `Bearer ${token}`,
    },
  })

  return data
}

export const useGetPayslip = (id: string | number) => {
  const {
    user: { token },
  } = useSelector((state: State) => state.user)

  const data = useQuery(payslipQKeys.payslip, () => getPayslip(id, token))
  return data
}

export const useGenerateP9Form = (filter: unknown) => {
  return useQuery([payslipQKeys.p9Forms, { filter }], generateP9Form, {
    enabled: true,
  })
}

export const EmailEmployeesP9 = async (payload: unknown) => {
  const response = await axios.post('/home/send/p9/forms', payload)

  return response.data
}

export const useEmailP9Mutation = () => {
  return useMutation(EmailEmployeesP9, {
    onSuccess: response => {
      console.log('response', response)
    },
    onError: error => {
      console.log('error', error)
    },
  })
}

const exportP9Report = async (payload: unknown) => {
  const response = await axios.get(`/home/export/p9/forms/${payload}`)

  return response.data
}

export const useExportP9Report = () => {
  const { environments, current } = useSelector(
    (state: State) => state.environments,
  )
  const url = environments[current].replace('/api/v2/', '')
  return useMutation(exportP9Report, {
    onSuccess: ({ data }) => {
      if (!_.isNull(data?.file_path)) {
        const pdf_url = url + data?.file_path
        const pdfUrlChunks = data?.file_path?.split('.')
        const pdfNameChunks = pdfUrlChunks[0].split('/')
        pdfDownloader(pdf_url, pdfNameChunks[3])
      }
    },
    onError: error => {
      console.log('error', error)
    },
  })
}
