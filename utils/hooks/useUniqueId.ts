import { useMemo } from 'react'

export function generateRandomString(prefix = '') {
  return `${prefix}${Math.random().toString(36).substr(2, 5)}`
}

export function useUniqueId(prefix?: string) {
  return useMemo(() => generateRandomString(prefix), [prefix])
}
