import { LoggedUser, UserAction } from '~declarations'
import ActionTypes from './types'

export const loginUser = (userData: LoggedUser): UserAction => {
  return {
    type: ActionTypes.SET_USER,
    payload: userData,
  }
}

export const logoutUser = (): UserAction => {
  return {
    type: ActionTypes.LOGOUT_USER,
  }
}
