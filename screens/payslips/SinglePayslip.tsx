import { capitalize, sumBy } from 'lodash'
import {
  Box,
  Button,
  Divider,
  Pressable,
  ScrollView,
  Text,
  Toast,
} from 'native-base'
import React from 'react'
import {
  useDownloadPayslip,
  useGetPayslip,
  useEmailPayslip,
} from '~api/payslip'
import LoaderScreen from '~components/LoaderScreen'
import ScreenHeader from '../../components/ScreenHeader'
import DownloadSvg from '~assets/svg/download.svg'
import ExportSvg from '~assets/svg/export.svg'
import DownloadPayslip from '~assets/svg/download-payslip.svg'
import PaymentDetails from './components/PaymentDetails'
import PayslipAccordion from './components/PayslipAccordion'
import PayslipItem from './components/PayslipItem'
import { BASE64, currencyFormatter } from '~utils/app-utils'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  PayslipRoutes,
} from '~types'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import { useFetchProfile } from '~api/home'
import LoadingModal from '~components/modals/LoadingModal'
import { useAccountSettings } from '~api/settings'
import SingleGlobalPayslip from './SingleGlobalPayslip'
import { useDownloadBlob } from '~utils/blobDownloader'
import SuccessAlert from '~components/SuccessAlert'

interface Props {
  navigation: MainNavigationProp<PayslipRoutes.SinglePayslip>
  route: MainNavigationRouteProp<PayslipRoutes.SinglePayslip>
}

const SinglePayslip = ({ route, navigation }: Props) => {
  // eslint-disable-next-line react/prop-types
  const { data: profileInfo } = useFetchProfile()
  const { data: settingsData, isLoading: settingsLoading } =
    useAccountSettings()
  const country = profileInfo?.data?.country_code ?? ''

  const isLocalPayslip = route.params.isLocalPayslip
  const payslip_id = route.params?.payslip.id

  const payslipParams = route.params?.payslip
  const encoded_payslip_id = BASE64.encode(`${payslip_id}`)
  const { data, isLoading } = useGetPayslip(payslip_id, isLocalPayslip)
  const payslip = data?.data
  const currencyCode = payslip?.currency_code ?? ''
  const isGlobal = settingsData?.data?.eor_enabled

  const { mutate, isLoading: downLoading } = useDownloadPayslip()
  const { downloadItem, isLoading: isDownloading } = useDownloadBlob()

  const { mutate: mutateEmail, isLoading: isEmailing } = useEmailPayslip()

  useStatusBarBackgroundColor('white')
  const kenyaDeductions = [
    {
      name: 'NSSF',
      value: payslip?.nssf,
    },
    {
      name: 'NHIF',
      value: payslip?.nhif,
    },
    {
      name: 'Pension',
      value: payslip?.pension,
    },
    {
      name: 'Housing Levy',
      value: payslip?.employee_housing_levy,
    },
    {
      name: 'Voluntary provident',
      value: payslip?.voluntary_provident,
    },
  ]

  const NigeriaDeductions = [
    {
      name: 'Pension',
      value: payslip?.nssf,
    },
    {
      name: 'NHIS',
      value: payslip?.nhif,
    },
  ]

  const RightItem = () => <DownloadBtn />
  const statutoryDeductions = [
    {
      name: 'PAYE',
      value: payslip?.paye,
    },
    ...(country == 'KE' ? kenyaDeductions : NigeriaDeductions),
  ]

  const handleDownload = () => {
    isGlobal && !isLocalPayslip
      ? downloadItem(encoded_payslip_id)
      : mutate(encoded_payslip_id)
  }

  const DeductionData = () => {
    return (
      <Box>
        <Divider />
        {statutoryDeductions.map((item, index) => (
          <PayslipItem
            key={index.toString()}
            label={item.name}
            value={currencyFormatter(item.value, currencyCode)}
          />
        ))}
        {payslip?.other_employee_deductions.length > 0
          ? payslip?.other_employee_deductions.map(
              (
                item: { name: string; amount: string },
                index: { toString: () => React.Key | null | undefined },
              ) => (
                <PayslipItem
                  key={index.toString()}
                  label={item.name}
                  value={currencyFormatter(item.amount, currencyCode)}
                />
              ),
            )
          : null}
      </Box>
    )
  }

  const EarningsData = () => {
    return (
      <Box>
        <Divider />
        <PayslipItem
          label="Basic Pay"
          value={currencyFormatter(payslip.salary_basic, currencyCode) ?? ''}
        />
        {payslip.allowances.length > 0
          ? payslip.allowances.map(
              (
                item: { name: string; amount: string },
                index: { toString: () => React.Key | null | undefined },
              ) => (
                <PayslipItem
                  key={index.toString()}
                  label={item.name}
                  value={currencyFormatter(item.amount, currencyCode)}
                />
              ),
            )
          : null}
      </Box>
    )
  }

  const DownloadBtn = () => {
    return (
      <Pressable onPress={handleDownload}>
        <DownloadSvg color="#253545" />
      </Pressable>
    )
  }

  const PayslipActionBtn = (p: { download?: boolean; loading: boolean }) => {
    const emailPayload = {
      employee_id: payslipParams.employee_id,
      month: payslipParams.month,
      year: payslipParams.year.toString(),
    }

    const handleEmail = () =>
      mutateEmail(emailPayload, {
        onSuccess(data) {
          Toast.show({
            render: () => {
              return (
                <SuccessAlert
                  description={
                    data?.message ?? 'Payslip will be emailed to you shortly'
                  }
                />
              )
            },
            placement: 'top',
            top: 100,
            duration: 3000,
          })
        },
      })

    const handleDownloadOrEmail = () => {
      p.download ? downloadItem(encoded_payslip_id) : handleEmail()
    }
    return (
      <Button
        onPress={handleDownloadOrEmail}
        width={'48%'}
        isLoading={p.loading}>
        <Box flexDirection="row" alignItems="center">
          {p.download ? (
            <DownloadPayslip color="white" />
          ) : (
            <ExportSvg color="white" />
          )}

          <Text
            fontSize="16px"
            lineHeight="26px"
            color="white"
            marginLeft="8px">
            {p.download ? 'Download' : 'Send to Email'}
          </Text>
        </Box>
      </Button>
    )
  }

  if (isLoading) {
    return <LoaderScreen />
  }

  const monthYear =
    capitalize(payslipParams.month) + ' ' + payslipParams.year ?? ''

  const newDeduction = [...statutoryDeductions]
  const totalDeductions = sumBy(newDeduction, function (o) {
    return parseFloat(o.value)
  })

  const net = currencyFormatter(payslip.net, currencyCode)
  const gross = currencyFormatter(payslip.gross, currencyCode)

  const totalDeductionsFormatted = currencyFormatter(
    totalDeductions,
    currencyCode,
  )
  const bankname = payslip?.payment_details?.bank.name ?? ''
  const accNo = payslip?.payment_details?.account_no ?? ''
  const bankDetails = bankname + ' ' + accNo

  return (
    <Box flex={1} safeArea backgroundColor="white" paddingX="16px">
      <ScreenHeader
        title={monthYear}
        // eslint-disable-next-line react/prop-types
        onPress={() => navigation.goBack()}
        RightItem={isGlobal && !isLocalPayslip ? undefined : RightItem}
      />
      {isGlobal && !isLocalPayslip ? (
        <Box flex={1} marginBottom="40px">
          <SingleGlobalPayslip payslip={payslip} />
          <Box justifyContent="space-between" flexDirection="row">
            <PayslipActionBtn download={true} loading={isDownloading} />
            <PayslipActionBtn loading={isEmailing} />
          </Box>
        </Box>
      ) : (
        <ScrollView flex={1} showsVerticalScrollIndicator={false} mt={'24px'}>
          <PaymentDetails
            name={payslip.employee_name}
            bank={bankDetails}
            date={monthYear}
            netPay={net}
          />
          <Box marginY="12px" />
          <PayslipAccordion
            title="Earnings (Gross)"
            total={gross ?? '-'}
            borderColor="green.20"
            bgColor="green.10"
            childData={<EarningsData />}
          />
          <Box marginY="12px" />
          <PayslipAccordion
            title="Deductions"
            total={totalDeductionsFormatted ?? '-'}
            borderColor="#F4CDC8"
            bgColor="#FCF4F3"
            childData={<DeductionData />}
          />
          <Box height={'40px'} />
        </ScrollView>
      )}

      <LoadingModal message="loading" isVisible={downLoading} />
    </Box>
  )
}

export default SinglePayslip
