import { Box, FlatList, HStack, Switch, Text } from 'native-base'
import React, { useRef, useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import NetCard from './components/NetCard'
import PayslipCard from './components/PayslipCard'
import RBSheet from 'react-native-raw-bottom-sheet'
import LoaderScreen from '../../components/LoaderScreen'
import ActionSheetBtn from '~components/buttons/ActionSheetBtn'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { CustomStatusBar } from '~components/customStatusBar'
import { useGetPayslipsInfinite, usePayrollBatches } from '~api/payslip'
import {
  AppModules,
  MainNavigationProp,
  MainNavigationRouteProp,
  PayslipRoutes,
} from '~types'
import { capitalize, isEmpty, noop, size, unionBy } from 'lodash'
import { TBatch, TPayslip } from './types'
import PayslipFilter from './components/PayslipFilter'
import EmptyState from '~components/empty-state/EmptyState'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import { currencyFormatter } from '~utils/app-utils'
import LoadMoreBtn from '~components/buttons/LoadMoreBtn'
import { RECORDS_PER_PAGE } from '~constants/comon'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import { useGetCompanies } from '~api/general'
import { useAccountSettings } from '~api/settings'

interface Props {
  navigation: MainNavigationProp<PayslipRoutes.Payslips>
  route: MainNavigationRouteProp<PayslipRoutes.Payslips>
}

const Payslips = ({ navigation }: Props) => {
  const [year, setYear] = useState('')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showOldPayslips, setShowOldPayslips] = useState(false)

  const params = {
    filter_by_year: year,
    recordsPerPage: RECORDS_PER_PAGE,
    access_local_payslips: showOldPayslips,
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: queryStatus,
    refetch,
    isRefetching,
  } = useGetPayslipsInfinite(params as any)

  const payslipsList = React.useMemo(
    () => data?.pages?.flatMap(page => page?.data?.data || []),
    [data?.pages],
  )

  const loadMore = isFetchingNextPage || !hasNextPage ? noop : fetchNextPage

  const renderFooter = () => {
    if (!hasNextPage) return null
    return (
      <Box>
        <LoadMoreBtn onPress={loadMore} loading={isFetchingNextPage} />
      </Box>
    )
  }
  const isLoading = queryStatus === 'loading'
  const { data: batchesData, isLoading: payrollLoading } = usePayrollBatches()
  const { data: settingsData, isLoading: settingsLoading } =
    useAccountSettings()
  const [open, setOpen] = useState(false)
  const [showAmount, setShowAmount] = useState(false)
  let years: TBatch[] = []
  let latestNetPay: number | string = '-'
  let latestCurrencyCode: string | undefined = ''
  const refRBSheet = useRef<RBSheet | null>(null)
  const { isLoading: loadingCompanies, data: companiesData } = useGetCompanies()
  useStatusBarBackgroundColor('#F1FDEB')

  const hasLocalPayrolls = Boolean(
    companiesData?.data?.data?.data[0]?.has_local_payrolls,
  )
  const isGlobal = Boolean(settingsData?.data?.eor_enabled)

  const renderItem = ({ item }: { item: TPayslip }) => {
    const monthYear = capitalize(item.month) + ' ' + item.year
    const currencyCode = item?.currency_code ?? ''
    const net = currencyFormatter(item.net, currencyCode)

    return (
      <PayslipCard
        date={monthYear}
        amount={net}
        status={item.is_paid ? 'Paid' : 'Not Paid'}
        payslip={item}
        showAmount={showAmount}
        isLocalPayslip={showOldPayslips}
      />
    )
  }
  const batches: TBatch[] = batchesData?.data?.data

  if (batches && batches.length > 0) {
    years = unionBy(batches, 'year')
  }

  const handlePress = (selectedYear: string, index: number) => {
    setSelectedIndex(index)
    setYear(selectedYear)
    analyticsTrackEvent(AnalyticsEvents.Payslips.select_sort_year, {
      year: selectedYear,
    })
    if (!open) {
      /* tslint:disable-next-line */
      refRBSheet.current.open()
    } else {
      /* tslint:disable-next-line */
      refRBSheet.current.close()
    }
  }

  const bottomSheetStyles = React.useMemo(() => {
    return {
      container: {
        paddingBottom: 60,
        borderTopRightRadius: 28,
        borderTopLeftRadius: 28,
        height: 'auto',
      },
    }
  }, [])

  const btnLabel = size(year.toString()) < 1 ? 'Select' : year
  if (payslipsList && payslipsList.length > 0) {
    latestCurrencyCode = !isEmpty(payslipsList[0].currency_code)
      ? payslipsList[0].currency_code
      : ''
    latestNetPay =
      currencyFormatter(payslipsList[0].net, latestCurrencyCode) ?? '-'
  }

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor="#F1FDEB" />
      <Box flex={1} backgroundColor="white">
        <Box
          backgroundColor={'green.10'}
          paddingX="16px"
        // pt={'5px'}
        >
          <ScreenHeader title="Payslips" onPress={() => navigation.goBack()} />
          <NetCard
            loading={isLoading}
            latestCurrencyCode={latestCurrencyCode}
            latestNetPay={latestNetPay}
            showAmount={showAmount}
            setShowAmount={setShowAmount}
          />
        </Box>

        {isLoading || payrollLoading || loadingCompanies ? (
          <LoaderScreen />
        ) : (
          <Box marginX="16px" marginTop="20px" flex={1}>
            <ActionSheetBtn
              onPress={() => refRBSheet.current?.open()}
              label={btnLabel}
            />
            {isGlobal && hasLocalPayrolls ? (
              <HStack
                alignItems="center"
                justifyContent="space-between"
                mt="20px">
                <Text fontSize={'16px'} color={'grey'}>
                  Show old payslips
                </Text>
                <Switch
                  isChecked={showOldPayslips}
                  onToggle={() => setShowOldPayslips(!showOldPayslips)}
                />
              </HStack>
            ) : (
              <Box my="20px" />
            )}

            {payslipsList?.length ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                flex={1}
                data={payslipsList}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                ListFooterComponent={renderFooter}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                refreshing={isRefetching}
                onRefresh={refetch}
              />
            ) : (
              <EmptyState moduleName={AppModules.payslips} />
            )}
          </Box>
        )}

        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          onOpen={() => {
            setOpen(true)
            analyticsTrackEvent(
              AnalyticsEvents.Payslips.click_select_sort_button,
              {},
            )
          }}
          onClose={() => setOpen(false)}
          closeOnPressMask={true}
          customStyles={bottomSheetStyles}>
          <PayslipFilter
            years={years}
            selectedIndex={selectedIndex}
            onPress={handlePress}
          />
        </RBSheet>
      </Box>
    </SafeAreaProvider>
  )
}

export default Payslips
