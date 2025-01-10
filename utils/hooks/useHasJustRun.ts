import { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { useManualTimeout } from './useManualTimeout'

export function useHasJustRun(
  callback: () => void,
  deps: any[],
  timeoutDelayMs = 1500,
) {
  const [hasTimedOut, runTimer] = useManualTimeout(timeoutDelayMs)
  const [hasJustRun, setHasJustRun] = useState(false)
  const run = useCallback(() => {
    callback()
    setHasJustRun(true)
  }, deps) /* eslint-disable-line react-hooks/exhaustive-deps */

  useLayoutEffect(() => {
    if (hasTimedOut) {
      setHasJustRun(false)
    }
  }, [hasTimedOut])

  useEffect(() => {
    if (hasJustRun) {
      return runTimer()
    }
  }, [hasJustRun, runTimer])

  return [run, hasJustRun] as const
}
