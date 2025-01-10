export function normalizeLocale(locale: string) {
  return locale.replace(/-.*/, '')
}
