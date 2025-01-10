import {getLocales} from 'react-native-localize';

export function getPlatformLocales() {
  return getLocales().map(({languageCode}) => languageCode);
}
