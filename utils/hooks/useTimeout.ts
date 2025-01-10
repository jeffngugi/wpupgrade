import { useEffect } from 'react'
import { useManualTimeout } from './useManualTimeout'

export function useTimeout(timeoutDelayMs: number | null) {
  const [hasTimedOut, run] = useManualTimeout(timeoutDelayMs)

  useEffect(run, [run])

  return hasTimedOut
}
