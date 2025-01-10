import axios, { AxiosError } from 'axios'
import { isNil } from 'lodash'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { State } from '~declarations'
import { useLogout } from '~hooks/useLogout'
import MainStackNavigator from '~navigation/MainStackNavigator'
import { setItem } from '~storage/device-storage'
import { loginUser } from '~store/actions/User'
import { createDatabase } from '~utils/database/database'
import NoNetNavigation from './NoInternetNavigation'
const MainApp = () => {
  const dispatch = useDispatch()
  const { logoutAndClearData } = useLogout()

  const {
    user: { company_id, id, employee_id, token },
  } = useSelector((state: State) => state.user)

  const { internetReachable, networkConnected } = useSelector(
    (state: State) => state.network,
  )

  if (isNil(company_id) || isNil(id) || isNil(employee_id) || isNil(token)) {
    logoutAndClearData()
    return null
  }
  const noConnection = !networkConnected || !internetReachable
  //create an sqlite database to store TA attempts locally
  useEffect(() => {
    createDatabase()
  }, [])
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  axios.defaults.params = {
    auth_company_id: company_id,
    auth_employee_id: employee_id,
    id: id,
    authorize_for: 'employee',
  }

  axios.interceptors.response.use(
    function (response) {
      if (response.headers.authorization || response.headers.Authorization) {
        const token =
          response.headers.authorization || response.headers.Authorization
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const user = {
          id,
          token: response.headers.authorization,
          employee_id,
          company_id,
        }
        dispatch(loginUser(user))
        setItem('userData', user)
      }
      return response
    },
    function (error: AxiosError) {
      if (error.response?.status === 401) {
        //remove user data from store
        logoutAndClearData()
        return
      }
      return Promise.reject(error)
    },
  )

  return (
    <>
      {noConnection && <NoNetNavigation />}
      {!noConnection && <MainStackNavigator />}
    </>
  )
}

export default MainApp
