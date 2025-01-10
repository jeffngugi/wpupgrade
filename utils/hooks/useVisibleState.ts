import { useState, useCallback } from 'react'

export function useVisibleState(defaultValue = false) {
  const [isVisible, setIsVisible] = useState(defaultValue)

  const toggle = useCallback(() => {
    setIsVisible(value => !value)
  }, [])

  const show = useCallback(() => setIsVisible(true), [])
  const hide = useCallback(() => setIsVisible(false), [])

  return [
    isVisible,
    {
      show,
      hide,
      toggle,
      setIsVisible,
    },
  ] as const
}
