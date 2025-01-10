import { useState, useCallback } from 'react'

export function useManualTimeout(timeoutDelayMs: number | null) {
  const [hasTimedOut, setHasTimedOut] = useState(false)

  const run = useCallback(
    function runTimer() {
      if (timeoutDelayMs === null) {
        setHasTimedOut(false)
        return
      }

      const timeout = setTimeout(() => {
        setHasTimedOut(true)
      }, timeoutDelayMs)

      return () => {
        clearTimeout(timeout)
        setHasTimedOut(false)
      }
    },
    [timeoutDelayMs],
  )

  return [hasTimedOut, run] as const
}
