import { EnvironmensState, EnvironmentAction } from '~declarations'
import ActionTypes from '~store/actions/types'

const currentState: EnvironmensState = {
  current: process.env.NODE_ENV === 'development' ? 'test' : 'production',
  environments: {
    test: 'https://test.workpay.co.ke/api/v2/',
    staging: 'https://staging-api.myworkpay.com/api/v2/',
    production: 'https://api-v2.myworkpay.com/api/v2/',
  },
}

const reducer = (
  state = currentState,
  { type, payload: current }: EnvironmentAction,
) => {
  switch (type) {
    case ActionTypes.SWITCH_ENVIRONMENT:
      return {
        ...state,
        current,
      }
    default:
      return state
  }
}

export default reducer
