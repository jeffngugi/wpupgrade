import { noop } from 'lodash'
import { Platform } from 'react-native'
import ReactNativeBlobUtil from 'react-native-blob-util'
import Share from 'react-native-share'
import { useSelector } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { State } from '~declarations'

// A function to handle the download
const fetchPayslip = async ({
  environment,
  encodedId,
  token,
  company_id,
  employee_id,
}: {
  environment: string
  encodedId: string
  token: string
  company_id: string
  employee_id: string
}) => {
  const url = `${environment}hrm/download/${encodedId}/payslip?auth_company_id=${company_id}&employee_id=${employee_id}&authorize_for=employee&access_local_payslips=${false}`

  const res = await ReactNativeBlobUtil.fetch('GET', url, {
    Authorization: 'Bearer ' + token,
  })

  const payslipBase64 = res.data
  return payslipBase64
}

export const useDownloadBlob = () => {
  const {
    user: { token, company_id, employee_id },
  } = useSelector((state: State) => state.user)

  const { environments, current } = useSelector(
    (state: State) => state.environments,
  )
  const environment = environments[current]

  // Use react-query's useMutation to handle the download and sharing logic
  const {
    mutate: downloadItem,
    isLoading,
    error,
  } = useMutation(
    async (encodedId: string) => {
      const payslipBase64 = await fetchPayslip({
        environment,
        encodedId,
        token,
        company_id,
        employee_id,
      })

      if (Platform.OS === 'android') {
        const shareOptions = {
          url: `data:application/pdf;base64,${payslipBase64}`,
          filename: 'Payslip',
        }
        await Share.open(shareOptions)
      } else {
        const dirs = ReactNativeBlobUtil.fs.dirs
        const path =
          dirs.DocumentDir + '/payslips/' + `payslip-${Date.now()}.pdf`
        await ReactNativeBlobUtil.fs.writeFile(path, payslipBase64, 'base64')
        await Share.open({
          subject: 'pdf share',
          url: path,
        })
      }
    },
    {
      onError: err => {
        console.error('Error downloading the file', err)
        noop() // Optional, handle errors as you see fit
      },
    },
  )

  return { downloadItem, isLoading, error }
}
