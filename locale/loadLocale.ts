import '@formatjs/intl-locale/polyfill'
import '@formatjs/intl-getcanonicallocales/polyfill'

import '@formatjs/intl-pluralrules/polyfill'
import '@formatjs/intl-pluralrules/locale-data/en'
import '@formatjs/intl-pluralrules/locale-data/fr'

import '@formatjs/intl-relativetimeformat/polyfill'
import '@formatjs/intl-relativetimeformat/locale-data/en'
import '@formatjs/intl-relativetimeformat/locale-data/fr'

import '@formatjs/intl-listformat/polyfill'
import '@formatjs/intl-listformat/locale-data/en'
import '@formatjs/intl-listformat/locale-data/fr'

import '@formatjs/intl-datetimeformat/polyfill'
import '@formatjs/intl-datetimeformat/add-golden-tz'
import '@formatjs/intl-datetimeformat/locale-data/en'
import '@formatjs/intl-datetimeformat/locale-data/fr'

import '@formatjs/intl-displaynames/polyfill'
import '@formatjs/intl-displaynames/locale-data/en'
import '@formatjs/intl-displaynames/locale-data/fr'

import '@formatjs/intl-numberformat/polyfill'
import '@formatjs/intl-numberformat/locale-data/en'
import '@formatjs/intl-numberformat/locale-data/fr'

import en from './messages/en.yaml'
import fr from './messages/fr.yaml'
import enCountries from 'i18n-iso-countries/langs/en.json'
import enDateFnsLocale from 'date-fns/locale/en-GB'
import frCountries from 'i18n-iso-countries/langs/fr.json'
import frDateFnsLocale from 'date-fns/locale/fr'

export const appLocales = {
  en: {
    rawMessages: en,
    localizedCountries: enCountries,
    dateFnsLocale: enDateFnsLocale,
  },
  fr: {
    rawMessages: fr,
    localizedCountries: frCountries,
    dateFnsLocale: frDateFnsLocale,
  },
}

export async function loadLocale(locale: keyof typeof appLocales) {
  return appLocales[locale]
}
