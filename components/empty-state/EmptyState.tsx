import React from 'react'
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
import p9FormIcon from '../../assets/svg/p9Form.svg'
import { AppModules } from '../../types'

type ErrorBoxProps = {
  title: string
  subTitle: string
  Icon: React.FC<SvgProps>
}

const EmptyState = ({ moduleName }: { moduleName: AppModules | string }) => {
  const ErrorBox = ({ title, subTitle, Icon }: ErrorBoxProps) => (
    <Box
      alignItems="center"
      justifyContent="center"
      backgroundColor="transparent"
      textAlign="center"
      marginX="50px"
      flex={1}>
      <Box marginY="10px">
        <Icon width={140} height={140} />
      </Box>
      <Text
        fontFamily="heading"
        fontSize="20px"
        color="charcoal"
        textAlign="center">
        {title}
      </Text>
      <Text
        textAlign="center"
        marginY="6px"
        fontSize={'16px'}
        color={'charcoal'}>
        {subTitle}
      </Text>
    </Box>
  )
  switch (moduleName) {
    case AppModules.leaves:
      return (
        <ErrorBox
          title="You have no leaves yet"
          subTitle="Apply for your leaves category and get approved quickly"
          Icon={LeaveIcon}
        />
      )
    case AppModules.expenses:
      return (
        <ErrorBox
          title="You have no expenses yet"
          subTitle="Record new expense by clicking the button below"
          Icon={ExpenseIcon}
        />
      )
    case AppModules.loans:
      return (
        <ErrorBox
          title="You have no loans yet"
          subTitle="Apply for a loan by clicking the button below"
          Icon={LoanIcon}
        />
      )
    case AppModules.overtime:
      return (
        <ErrorBox
          title="You have no overtime request"
          subTitle="Apply overtime by clicking the button below"
          Icon={OvertimeIcon}
        />
      )
    case AppModules.documents:
      return (
        <ErrorBox
          title="You have no document yet"
          subTitle="When you upload documents they will appear here"
          Icon={DocumentIcon}
        />
      )
    case AppModules.assets:
      return (
        <ErrorBox
          title="You have no assets yet"
          subTitle="Assets assigned to you will show up here"
          Icon={AssetIcon}
        />
      )
    case AppModules.advances:
      return (
        <ErrorBox
          title="You have no salary advance’s yet"
          subTitle="Apply for salary advance by clicking the button below"
          Icon={AdvanceIcon}
        />
      )
    case AppModules.ta:
      return (
        <ErrorBox
          title="You have no records yet"
          subTitle="Clock and clock out to record your attendence"
          Icon={TAIcon}
        />
      )
    case AppModules.payslips:
      return (
        <ErrorBox
          title="You have no payslips yet"
          subTitle="Your payslips will show up here"
          Icon={PayslipIcon}
        />
      )
    case AppModules.p9:
      return (
        <ErrorBox
          title="No P9 Forms"
          subTitle="Generate your P9 Forms to view them"
          Icon={p9FormIcon}
        />
      )
    default:
      return (
        <ErrorBox
          title="No Data found"
          subTitle="Please check with your line manager to ensure you have data for above"
          Icon={LeaveIcon}
        />
      )
  }
}

export default EmptyState
