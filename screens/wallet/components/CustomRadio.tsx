import React from 'react'
import { Box } from 'native-base'
import InactiveBtn from '~assets/svg/inactive-radio.svg'
import ActiveBtn from '~assets/svg/active-radio.svg'

const CustomRadio = ({ selected }: { selected: boolean }) => {
  return <Box>{selected ? <ActiveBtn /> : <InactiveBtn />}</Box>
}

export default CustomRadio
