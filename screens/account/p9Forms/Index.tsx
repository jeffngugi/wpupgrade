import {
  Alert,
  Box,
  Button,
  FlatList,
  HStack,
  Pressable,
  Spinner,
  Text,
  VStack,
} from 'native-base'
import React, { useRef, useState } from 'react'
import RBSheet from 'react-native-raw-bottom-sheet'
import { usePayrollBatches } from '~api/payslip'
import {
  AppModules,
  MainNavigationProp,
  MainNavigationRouteProp,
  PayslipRoutes,
} from '~types'
import { isEmpty, noop } from 'lodash'
import { TPayslip } from '../../../types'
import EmptyState from '~components/empty-state/EmptyState'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import { currencyFormatter } from '~utils/app-utils'
import LoadMoreBtn from '~components/buttons/LoadMoreBtn'
import { RECORDS_PER_PAGE } from '~constants/comon'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import LoaderScreen from '~components/LoaderScreen'
import ScreenHeader from '~components/ScreenHeader'
import { generateP9Form } from '~api/p9Forms'
import SubmitButton from '~components/buttons/SubmitButton'
import { useForm } from 'react-hook-form'
import DropDownPicker from '~components/DropDownPicker'
import { useMyProfile } from '~api/account'
import P9FormCard from './components/P9FormCard'
import { AxiosResponse } from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import { payslipQKeys } from '~api/QueryKeys'
import CloseIcon from '~assets/svg/x.svg'

interface Props {
  navigation: MainNavigationProp<PayslipRoutes.Payslips>
  route: MainNavigationRouteProp<PayslipRoutes.Payslips>
}

type BatchObject = {
  value: string
  label: string
}

const P9Forms = ({ navigation }: Props) => {
  useStatusBarBackgroundColor('#F1FDEB')
  const getCurrentYear = new Date().getFullYear()
  const [year, setYear] = useState(getCurrentYear.toString())
  const [actionSheetOpen, setActionSheetOpen] = useState(false)
  const [generatedSuccess, setGeneratedSuccess] = useState(false)
  const { data: batchesData, isLoading: payrollLoading } = usePayrollBatches()
  const [open, setOpen] = useState('')
  const [items, setItems] = useState([])
  const profileQuery = useMyProfile()
  const profileInfo = profileQuery.data?.data
  const emloyeeId = profileInfo?.id

  function createNewArray(array: []) {
    const newArray: string[] = []
    array.forEach((item: any) => {
      if (item.year) {
        newArray.push(item.year)
      }
    })
    return newArray
  }

  function setYearOptions(data: AxiosResponse) {
    const batches = data?.data?.data ? createNewArray(data?.data?.data) : []
    const batchesSet = batches.length > 0 ? [...new Set(batches)] : []

    const result: BatchObject[] = []

    if (batchesSet?.length > 0) {
      batchesSet.forEach(batch => {
        const batchObject = {
          value: batch.toString(),
          label: batch.toString(),
        }

        result.push(batchObject)
      })
    }
    return result
  }

  const yearOptions = setYearOptions(batchesData)

  const filters = {
    'employee_ids[0]': emloyeeId,
    year: year,
  }

  const params = {
    filter_by_year: year,
    recordsPerPage: RECORDS_PER_PAGE,
    ...filters,
  }

  const useGetP9FormsInfinite = (filters: any) => {
    return useInfiniteQuery({
      queryKey: [...payslipQKeys.p9Forms, { filters }],
      queryFn: () =>
        generateP9Form({ queryKey: [...payslipQKeys.p9Forms, { filters }] }),
      getNextPageParam: (lastPage, pages) => {
        const lastPageData = lastPage?.data?.data
        return lastPageData?.next_page_url
          ? lastPageData?.current_page + 1
          : null
      },
      enabled: !isEmpty(filters),
      retry: false,
      onSuccess: () => {
        refRBSheet.current.close()
        requestAnimationFrame(() => setGeneratedSuccess(true))
        setTimeout(() => {
          setGeneratedSuccess(false)
        }, 5000)
      },
    })
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status: queryStatus,
    refetch,
    isRefetching,
  } = useGetP9FormsInfinite(params as any)

  const payslipsList = React.useMemo(
    () => data?.pages?.flatMap(page => page?.data?.data?.data || []),
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

  const refRBSheet = useRef<RBSheet | null>(null)
  const { control } = useForm()

  const renderItem = ({ item }: { item: TPayslip }) => {
    const currencyCode = item?.currency_code ?? ''
    const net = currencyFormatter(item.sum_gross, currencyCode)
    return (
      <P9FormCard
        date={item.year}
        amount={net}
        status={item?.year ?? ''}
        payslip={item}
        showAmount={true}
        year={item.year}
      />
    )
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

  const submitGenerateP9Form = () => {
    refetch().then(res => {
      refRBSheet.current?.open()
    })
  }

  const loadingForms = isFetching || isRefetching
  return (
    <Box safeArea flex={1} backgroundColor="white">
      <Box paddingX="16px">
        <ScreenHeader title="P9 Forms" onPress={() => navigation.goBack()} />
      </Box>

      {isLoading || payrollLoading ? (
        <LoaderScreen />
      ) : (
        <Box marginX="16px" marginTop="20px" flex={1}>
          {generatedSuccess ? (
            <SuccessAlert onClose={() => setGeneratedSuccess(true)} />
          ) : null}
          <Box height="24px" />
          {payslipsList?.length ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              flex={1}
              data={payslipsList}
              renderItem={renderItem}
              keyExtractor={(item: unknown, index: number) => index.toString()}
              ListFooterComponent={renderFooter}
              onEndReached={loadMore}
              onEndReachedThreshold={0.1}
              refreshing={isRefetching}
              // onRefresh={refetch}
            />
          ) : (
            <>
              <EmptyState moduleName={AppModules.p9} />
            </>
          )}
          <SubmitButton
            loading={isLoading}
            onPress={() => refRBSheet.current?.open()}
            title="Generate your P9 Form"
          />
        </Box>
      )}

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        onOpen={() => {
          setActionSheetOpen(true)
          analyticsTrackEvent(
            AnalyticsEvents.Payslips.click_select_sort_button,
            {},
          )
        }}
        onClose={() => setActionSheetOpen(false)}
        closeOnPressMask={true}
        customStyles={bottomSheetStyles}>
        <Box paddingX="16px">
          <Text mb="5px" mt={'12px'} color={'grey'}>
            Year
          </Text>
          <DropDownPicker
            control={control}
            value={year}
            open={open === 'year'}
            options={yearOptions}
            setOptions={setItems}
            setValue={setYear}
            zIndex={1005}
            setOpen={() => {
              open === 'year' ? setOpen('') : setOpen('year')
            }}
            rules={{
              required: { value: true, message: 'Year is required' },
            }}
            name="currency"
          />
          <Box height="20px" />
          <Box
            my={'40px'}
            flexDirection={'row'}
            justifyContent={'space-between'}>
            <Button
              backgroundColor="#ffffff"
              borderColor={'#62A446'}
              borderWidth={1}
              borderRadius={6}
              paddingX={10}
              onPress={() => refRBSheet.current.close()}>
              <Text
                color={'#62A446'}
                marginX={'18px'}
                marginY={2}
                fontFamily={'heading'}
                fontSize={'16px'}>
                Cancel
              </Text>
            </Button>
            <Button
              backgroundColor="#62A446"
              borderRadius={6}
              paddingX={10}
              onPress={submitGenerateP9Form}>
              {loadingForms ? (
                <HStack>
                  <Spinner color={'white'} />
                  <Text color="white">Generating</Text>
                </HStack>
              ) : (
                <Text
                  color={'#ffffff'}
                  marginX={'18px'}
                  marginY={2}
                  fontFamily={'heading'}
                  fontSize={'16px'}>
                  Generate
                </Text>
              )}
            </Button>
          </Box>
        </Box>
      </RBSheet>
    </Box>
  )
}

const SuccessAlert = ({ onClose }: { onClose: () => void }) => {
  return (
    <Alert
      maxW="400"
      status="success"
      colorScheme="info"
      backgroundColor="green.20">
      <VStack space={2} flexShrink={1} w="100%">
        <HStack
          flexShrink={1}
          space={2}
          alignItems="center"
          justifyContent="space-between">
          <HStack flexShrink={1} space={2} alignItems="center">
            <Alert.Icon />
            <Text fontSize="md" fontWeight="medium" color="coolGray.800">
              Success
            </Text>
          </HStack>
          <Pressable onPress={onClose}>
            <CloseIcon color={'#72777B'} width={24} height={24} />
          </Pressable>
        </HStack>
        <Box
          pl="6"
          _text={{
            color: 'coolGray.600',
          }}>
          P9 form successfully generated. Kindly download or send to email below
        </Box>
      </VStack>
    </Alert>
  )
}

export default P9Forms
