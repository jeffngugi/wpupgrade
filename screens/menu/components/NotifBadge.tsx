import React from 'react'
import { Box } from 'native-base'
type Props = {
  gridView?: boolean
}

const NotifBadge = ({ gridView, ...rest }: Props) => (
  <Box
    rounded="full"
    width="14px"
    height="14px"
    backgroundColor="red.50"
    position="absolute"
    top={gridView ? '-6px' : 0}
    right={gridView ? '-6px' : 0}
    {...rest}
  />
)

export default NotifBadge
