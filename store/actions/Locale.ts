import { LocaleAction, SupportedLocale } from '~declarations'
import ActionTypes from './types'

export const setUserPreferredLocale = (
  payload: SupportedLocale,
): LocaleAction => {
  return {
    type: ActionTypes.SET_USER_PREFERRED_LOCALE,
    payload,
  }
}
