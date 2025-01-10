import React from 'react'
import { Box, Text, Button } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { AppModules, LoanRoutes } from '~types'
import EmptyStateDynamic from '~components/empty-state/EmptyStateDynamic'
import LoanIcon from '~assets/svg/loan.svg'
import SubmitButton from '~components/buttons/SubmitButton'

const NoLoans = ({ loanCategory }: { loanCategory?: string }) => {
  const navigation = useNavigation()
  return (
    <Box flex={1} backgroundColor="white">
      <Box flex={1} alignItems="center" justifyContent="center">
        <EmptyStateDynamic
          moduleName={AppModules.loans}
          title={`You have no ${loanCategory?.toLowerCase()} loans yet`}
          subTitle="Apply for a loan by clicking the button"
          Icon={LoanIcon}
        />
      </Box>

      <SubmitButton
        onPress={() => navigation.navigate(LoanRoutes.Apply)}
        title="Apply for a loan"
      />
    </Box>
  )
}

export default NoLoans
