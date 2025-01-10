import React, { ComponentProps } from 'react'
import { ViewProps } from 'react-native'

import { useTimeout } from '../utils'
import { PlatformIndicator } from '../components/PlatformIndicator'

export type Props = ComponentProps<typeof PlatformIndicator> & {
  timeoutMs?: number | null
  style?: ViewProps['style']
}

export function PlatformActivityIndicator({
  timeoutMs = 300,
  ...props
}: Props) {
  const hasTimedOut = useTimeout(timeoutMs) as unknown as boolean
[]

  if (timeoutMs !== null && !hasTimedOut) {
    return null
  }

  return <PlatformIndicator {...props} />
}
