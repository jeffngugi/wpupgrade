import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

const PeopleIcon = (props: SvgProps) => (
  <Svg width={22} height={20} {...props}>
    <Path
      d="M21 19v-2a4.002 4.002 0 0 0-3-3.874M14.5 1.291a4.001 4.001 0 0 1 0 7.418M16 19c0-1.864 0-2.796-.305-3.53a4 4 0 0 0-2.164-2.165C12.796 13 11.864 13 10 13H7c-1.864 0-2.796 0-3.53.305a4 4 0 0 0-2.166 2.164C1 16.204 1 17.136 1 19M12.5 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
      stroke="#62A446"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default PeopleIcon
