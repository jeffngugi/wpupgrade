import axios from 'axios'
import { LoginUser, ForgotPass, ResetPass } from '.'
import { omit } from 'lodash'

export const login = async (loginUser: LoginUser) => {
  const loginUserPayload = omit(loginUser, 'skipPinScreen')
  const { data } = await axios.post('user/login', loginUserPayload)
  return data
}

export const forgotPass = async (credential: ForgotPass) => {
  const { data } = await axios.post('send/reset/email', credential)
  return data
}

export const resetPassword = async (resetParams: ResetPass) => {
  const { data } = await axios.post('recover/account/email', resetParams)
  return data
}
