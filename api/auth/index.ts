import { useMutation } from '@tanstack/react-query'
import { login, forgotPass, resetPassword } from './request'

export interface LoginUser {
  email: string
  password: string
  skipPinScreen?: boolean
}

export interface ForgotPass {
  email: string
}

export interface ResetPass {
  token: string
  password: string
  password_confirmation: string
}

export const useloginMutation = () => {
  return useMutation((loginUserPayload: LoginUser) => login(loginUserPayload))
}

export const useForgotPassword = () => {
  return useMutation((credentials: ForgotPass) => forgotPass(credentials))
}

export const useResetPassword = () => {
  return useMutation((resets: ResetPass) => resetPassword(resets))
}
