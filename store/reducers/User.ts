import { LoggedUser, UserAction, UserState } from '~declarations'
import ActionTypes from '~store/actions/types'

const currentState: UserState = {
  isLoggedIn: false,
  user: {
    token: '',
    id: '',
    employee_id: '',
    company_id: '',
  },
}

const reducer = (state = currentState, action: UserAction) => {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      }
    case ActionTypes.LOGOUT_USER:
      return {
        ...state,
        isLoggedIn: false,
        user: {} as LoggedUser,
      }
    default:
      return state
  }
}

export default reducer
