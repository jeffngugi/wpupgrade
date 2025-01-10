import { OnboardingAction } from '~declarations'
import ActionTypes from './types'

export const setOnboarded = (): OnboardingAction => {
  return {
    type: ActionTypes.SET_ONBOARDED,
  }
}
