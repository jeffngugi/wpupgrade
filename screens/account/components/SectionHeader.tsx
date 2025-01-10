import React from 'react'
import { Box } from 'native-base'
import AccountHeader from './AccountHeader'
import AccountHero from './AccountHero'

const SectionHeader = () => (
  <Box backgroundColor="green.10" paddingX="16px" paddingTop={'24px'}>
    <AccountHeader />
    <AccountHero />
  </Box>
)

export default SectionHeader
