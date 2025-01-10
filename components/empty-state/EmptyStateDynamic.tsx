import React from 'react'
import { Text as TextRn } from 'react-native'
import { Box, Text } from 'native-base'
import { SvgProps } from 'react-native-svg'
import LeaveIcon from '../../assets/svg/leaves.svg'
import ExpenseIcon from '../../assets/svg/expenses.svg'
import LoanIcon from '../../assets/svg/loan.svg'
import DocumentIcon from '../../assets/svg/documents.svg'
import PayslipIcon from '../../assets/svg/payslip.svg'
import OvertimeIcon from '../../assets/svg/overtime.svg'
import AssetIcon from '../../assets/svg/assets.svg'
import AdvanceIcon from '../../assets/svg/salary-advance.svg'
import TAIcon from '../../assets/svg/t-a.svg'
import { AppModules } from '../../types'

type ErrorBoxProps = {
  title: string
  subTitle: string
  Icon: React.FC<SvgProps>
}

type EmptyStateProps = {
  moduleName: AppModules | string
  title: string
  subTitle: string
  Icon: React.FC<SvgProps>
}

const EmptyStateDynamic = ({
  moduleName,
  title,
  subTitle,
  Icon,
}: EmptyStateProps) => {
  const ErrorBox = ({ title, subTitle, Icon }: ErrorBoxProps) => (
    <Box
      alignItems="center"
      justifyContent="center"
      backgroundColor="transparent"
      textAlign="center"
      marginX="10px"
      flex={1}>
      <Box marginY="10px">
        <Icon width={140} height={140} />
      </Box>
      <Text
        fontFamily={'heading'}
        fontSize="20px"
        color="charcoal"
        textAlign="center">
        {title}
      </Text>

      <Text
        textAlign="center"
        marginY="6px"
        fontSize="16px"
        fontFamily={'body'}>
        {subTitle}
      </Text>
    </Box>
  )

  return <ErrorBox title={title} subTitle={subTitle} Icon={Icon} />
}

export default EmptyStateDynamic
