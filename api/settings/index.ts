import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { settingQKeys } from '~api/QueryKeys'

export const getFeatures = async () => {
  const { data } = await axios.get('company-enabled-features')
  return data
}

export const useEnabledFeatures = () => {
  const data = useQuery(settingQKeys.features, getFeatures)
  return data
}

const getAccountSettings = async () => {
  const { data } = await axios.get('home/company/account-settings')
  return data
}

export const useAccountSettings = () => {
  const data = useQuery(settingQKeys.account, getAccountSettings)
  return data
}
