import { enGB, fr } from 'date-fns/locale'
import i18next from 'i18next'

export const locales = {
  fr,
  en: enGB,
}

export type SupportedLanguageKeys = keyof typeof locales

export const getCurrentLocale = () =>
  locales[i18next.language as SupportedLanguageKeys] ?? enGB
export const setCurrentLocale = async (language: string) =>
  i18next.changeLanguage(language)
