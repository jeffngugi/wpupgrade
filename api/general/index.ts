import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Dispatch } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { queryClient } from '~ClientApp'
import { State, UserAction } from '~declarations'
import { setItem } from '~storage/device-storage'
import { loginUser } from '~store/actions/User'

export const fetchCurrencies = async () => {
  const response = await axios.get('setup/currencies')
  return response
}

export function useCurrencies() {
  return useQuery(['currencyOptions'], fetchCurrencies)
}

const getCompanies = async () => {
  const response = await axios.get('home/companies', {
    params: { for_employee_portal: 1 },
  })
  return response
}

export const useGetCompanies = () => {
  const data = useQuery(['employee-companies'], getCompanies)
  return data
}

const switchCompany = async (payload: any) => {
  const { data } = await axios.post('home/companies/switch', payload)
  return data
}

export const useSwitchCompany = () => {
  const dispatch: Dispatch<UserAction> = useDispatch()
  const {
    user: { id, employee_id, token },
  } = useSelector((state: State) => state.user)
  return useMutation(switchCompany, {
    onSuccess: async data => {
      if (data.success) {
        // console.log('This is a successful company switch', data?.data?.id)
        const newUserData = {
          id,
          token,
          employee_id,
          company_id: data?.data?.id,
        }
        dispatch(loginUser(newUserData))
        await setItem('userData', newUserData)
        queryClient.invalidateQueries()
      }
    },
  })
}

const getWpPayPoints = async () => {
  const response = await axios.get('setup/workpay-paypoints', {
    params: { for_employee_portal: 1 },
  })
  return response
}

export const useGetWpPayPoints = () => {
  const data = useQuery(['wp-pay-points'], getWpPayPoints)
  return data
}
