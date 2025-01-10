import { LocaleState, LocaleAction } from '~declarations'
import ActionTypes from '~store/actions/types'

const currentState: LocaleState = {
  userPreferredLocale: null,
}

const reducer = (
  state = currentState,
  { type, payload: userPreferredLocale }: LocaleAction,
) => {
  switch (type) {
    case ActionTypes.SET_USER_PREFERRED_LOCALE:
      return {
        ...state,
        userPreferredLocale,
      }
    default:
      return state
  }
}

export default reducer
