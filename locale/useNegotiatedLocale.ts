import {useSuspenseCacheValue} from '../storage/cache';
import {useSelector} from 'react-redux';
import {getNegotiatedLocale} from './index';
import {loadRichLocale} from './localeResource';

export function useNegotiatedLocale() {
  const localeKey = useSelector(getNegotiatedLocale);
  const [data] = useSuspenseCacheValue(localeKey, {
    duration: 'memory',
    namespace: 'locale',
    scope: 'device',
    defaultValue: loadRichLocale,
    keepStale: true,
  });

  return {locale: localeKey, ...data};
}
