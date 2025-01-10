import { noop } from 'lodash'
import { useState } from 'react'

import { Platform } from 'react-native'
import ReactNativeBlobUtil from 'react-native-blob-util'
import Share from 'react-native-share'
import { useSelector } from 'react-redux'
import { State } from '~declarations'

export const useDownloadBlobWallet = () => {
  const [loading, setLoading] = useState(false)
  const {
    user: { token, company_id, employee_id },
  } = useSelector((state: State) => state.user)

  const { environments, current } = useSelector(
    (state: State) => state.environments,
  )
  const environment = environments[current]

  const downloadItem = (encodedId: string, params: any) => {
    setLoading(true)
    const url = `${environment}wallet-api/transactions/receipt/${encodedId}?auth_company_id=${company_id}&employee_id=${employee_id}&authorize_for=employee`

    const buildQueryString = (obj, prefix = '') => {
      console.log('obj', obj)
      return obj
        ? Object.keys(obj)
            .map(key => {
              const value = obj?.[key]
              const prefixedKey = prefix ? `${prefix}[${key}]` : key
              return typeof value === 'object'
                ? buildQueryString(value, prefixedKey)
                : `${encodeURIComponent(prefixedKey)}=${encodeURIComponent(
                    value,
                  )}`
            })
            .join('&')
        : ''
    }

    const queryString = buildQueryString(params)
    const urlWithParams = `${url}&${queryString}`

    ReactNativeBlobUtil.fetch('GET', urlWithParams, {
      Authorization: 'Bearer ' + token,
    })
      .then(async res => {
        const payslipBase64 = res.data
        setLoading(false)
        try {
          if (Platform.OS === 'android') {
            const shareOptions = {
              url: `data:application/pdf;base64,${payslipBase64}`,
              filename: `${params?.type ?? 'transaction'}`,
            }
            await Share.open(shareOptions)
          } else {
            const dirs = ReactNativeBlobUtil.fs.dirs
            const path =
              dirs.DocumentDir +
              '/wallets/' +
              `${params?.type ?? 'transaction'}-${Date.now()}.pdf`
            ReactNativeBlobUtil.fs
              .writeFile(path, payslipBase64, 'base64')
              .then(result => {
                Share.open({
                  subject: 'pdf share',
                  url: path,
                })
              })
              .catch(error => noop())
          }
        } catch (error) {
          console.log('Share error', error)
        }
      })
      .catch(err => noop())
      .finally(() => setLoading(false))
  }

  return { downloadItem, loading }
}
