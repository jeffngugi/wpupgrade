import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {NativeModules} from 'react-native';
import {isAndroid, isIos} from './utils/platforms';
import en from './locale/translations/en.json';
import fr from './locale/translations/fr.json';
import {getItem} from '~storage/device-storage';
import {DateFormat, formatDate} from '~utils/date';

const supportedLngs = ['fr', 'en'];
let locale = 'en';
export type Languages = typeof resources;

if (isAndroid) {
  locale = NativeModules.I18nManager.localeIdentifier || 'en';
} else if (isIos) {
  locale = NativeModules?.SettingsManager?.settings?.AppleLanguages[0] || 'en';
}

if (!supportedLngs.includes(locale)) {
  locale = 'en';
}
const resources = {
  fr,
  en,
};

const initI18 = async () => {
  const lang = (await getItem('language')) as string;
  i18next.use(initReactI18next).init({
    resources,
    compatibilityJSON: 'v3',
    lng: lang || locale,
    fallbackLng: ['en', 'fr'],
    // keySeparator: false,
    // debug: __DEV__,
    interpolation: {
      format: (value: Date, format) => {
        if (value instanceof Date) {
          return formatDate(value, format as DateFormat);
        }
        return value;
      },
    },
  });
};
initI18();
