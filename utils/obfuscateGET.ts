import isNil from 'lodash/isNil'
import omit from 'lodash/omit'
import { AxiosRequestConfig } from 'axios'
import { parseQueryString, stringifyQuery } from './queryString'
import { isEmpty } from 'lodash'
import { parse, format } from 'url'
import type { ClientRequest } from 'http'

export const OBFUSCATED_GET_HEADER = 'x-obfuscated-get'

export function obfuscateGET(config: AxiosRequestConfig): AxiosRequestConfig {
  if (isNil(config.method) || config.method.toUpperCase() === 'GET') {
    return {
      ...omit(config, 'params'),
      headers: {
        ...config.headers,
        [OBFUSCATED_GET_HEADER]: true,
      },
      method: 'POST',
      data: config.params,
    }
  }

  return config
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deobfuscateGET(proxyReq: ClientRequest, req: any) {
  if (req.method === 'POST' && req.headers[OBFUSCATED_GET_HEADER]) {
    if (!isEmpty(req.body)) {
      const url = parse(req.path)
      proxyReq.path = format({
        ...url,
        search: stringifyQuery({
          ...parseQueryString(url.search ?? ''),
          ...req.body,
        }),
      })
    }

    proxyReq.method = 'GET'
    proxyReq.removeHeader(OBFUSCATED_GET_HEADER)
    proxyReq.removeHeader('Content-Type')
    proxyReq.setHeader('Content-Length', 0)
    proxyReq.write('')
    proxyReq.end()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shouldParseBodyForDeobfuscateGET(req: any) {
  return !!req.headers[OBFUSCATED_GET_HEADER]
}
