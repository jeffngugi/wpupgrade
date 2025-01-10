import { OnboardingAction, OnboardingState } from '~declarations'
import ActionTypes from '~store/actions/types'

const currentState: OnboardingState = {
  onboarded: false,
}

const reducer = (state = currentState, action: OnboardingAction) => {
  switch (action.type) {
    case ActionTypes.SET_ONBOARDED:
      return {
        ...state,
        onboarded: true,
      }
    default:
      return state
  }
}

export default reducer
