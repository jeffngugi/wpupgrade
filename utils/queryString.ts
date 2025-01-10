import Qs from 'qs'

export function parseQueryString(queryString: string) {
  return Qs.parse(queryString, {
    ignoreQueryPrefix: true,
  })
}

export function stringifyQuery(
  query: Record<string, any>,
  { addQueryPrefix = false } = {},
) {
  return Qs.stringify(query, { arrayFormat: 'brackets', addQueryPrefix })
}
