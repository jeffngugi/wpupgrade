import {getPlatformLocales} from './getPlatformLocales';
import {normalizeLocale} from './normalizeLocale';
import {createSelector} from 'reselect';
import {State, SupportedLocale} from '../declarations';
import {appLocales} from './loadLocale';

export const getUserPreferredLocale = (state: State) => {
  return state.locale.userPreferredLocale;
};

export const supportedLocales: readonly string[] = Object.keys(appLocales);

function negotiateLocale(
  preferredLocale: SupportedLocale | null | undefined,
  platformLocales: string[],
) {
  const locale = preferredLocale || platformLocales[0];
  const normalizedLocale = normalizeLocale(locale);
  if (supportedLocales.includes(normalizedLocale)) {
    return normalizedLocale;
  }

  return supportedLocales[0];
}

export const getNegotiatedLocale = createSelector(
  getUserPreferredLocale,
  preferredLocale => negotiateLocale(preferredLocale, getPlatformLocales()),
);
