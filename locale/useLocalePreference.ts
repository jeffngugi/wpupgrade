import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNegotiatedLocale } from './useNegotiatedLocale'
import { setUserPreferredLocale, getUserPreferredLocale } from './index'

export function useLocalePreference() {
  const { locale } = useNegotiatedLocale()
  const lastUsedLocale = useSelector(getUserPreferredLocale)
  const isAuto = lastUsedLocale === null

  const dispatch = useDispatch()
  const setLocale = useCallback(
    (locale: string | null) => {
      dispatch(setUserPreferredLocale(locale))
    },
    [dispatch],
  )

  return [locale, setLocale, isAuto]
}
