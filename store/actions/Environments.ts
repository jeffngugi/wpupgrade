import { Environment, EnvironmentAction } from '~declarations'
import ActionTypes from '~store/actions/types'

export const switchEnvironment = (payload: Environment): EnvironmentAction => {
  return {
    type: ActionTypes.SWITCH_ENVIRONMENT,
    payload,
  }
}
