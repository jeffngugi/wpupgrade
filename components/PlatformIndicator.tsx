import React from 'react'
import { Platform } from 'react-native'
import {
  MaterialIndicator,
  DotIndicator,
  UIActivityIndicator,
  UIActivityIndicatorProps,
  DotIndicatorProps,
} from 'react-native-indicators'

/**
 * @todo Create Workpay theme hook and apply our brand's tertiary color as the color prop to the returned component
 *
 * import { useTheme } from 'theme location'
 * const { colors: { brandTertiary } } = useTheme()
 *
 * return <Component size={35} color={brandTertiary} {...props} />
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Component = Platform.select({
  ios: UIActivityIndicator,
  android: MaterialIndicator,
  default: function ThreeDotIndicator(
    props: JSX.IntrinsicAttributes &
      JSX.IntrinsicClassAttributes<DotIndicator> &
      Readonly<DotIndicatorProps>,
  ) {
    return <DotIndicator {...props} count={3} />
  },
})

export function PlatformIndicator(
  props: JSX.IntrinsicAttributes &
    JSX.IntrinsicClassAttributes<UIActivityIndicator> &
    Readonly<UIActivityIndicatorProps>,
) {
  return <Component size={35} {...props} />
}
