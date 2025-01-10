import { extendTheme } from 'native-base'
import { colors } from './foundations/colors'
import { components } from './components'
import { fontConfig } from './foundations/fontConfig'
import { fonts } from './foundations/fonts'

export const customTheme = extendTheme({
  colors,
  fontConfig,
  fonts,
  useSystemColorMode: false,
  components,
})

type CustomThemeType = typeof customTheme

declare module 'native-base' {
  type ICustomTheme = CustomThemeType
}
