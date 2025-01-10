import flat from 'flat'
import uniq from 'lodash/uniq'
import compact from 'lodash/compact'
import { loadLocale } from './loadLocale'
import last from 'lodash/last'
import moment from 'moment'
import countries from 'i18n-iso-countries'

type Data = {
  messages: Record<string, string>
  // @ts-ignore
  dateFnsLocale: typeof import('date-fns/locale/en')
}

export async function loadRichLocale(localeKey: string) {
  const localesToLoad = compact(
    /**
     * @todo configure global.CONFIG.defaultLocale
     */
    uniq(['en', 'en' | 'fr', localeKey]),
  )
  const loadedLocales = await Promise.all(localesToLoad.map(loadLocale))

  const resolved = {
    ...last(loadedLocales),
    messages: flat(
      Object.assign(
        {},
        ...Object.values(loadedLocales).map(locale => locale.rawMessages),
      ),
    ),
  }

  moment.locale(localeKey)
  // @ts-ignore
  countries.registerLocale(resolved.localizedCountries)

  return resolved as Data
}
