import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, ScrollView, Text } from 'native-base'
import ScreenHeader from '../../components/ScreenHeader'
import {
  AccountsRoutes,
  MainNavigationProp,
  MainNavigationRouteProp,
} from '../../types'
import { useTranslation } from 'react-i18next'
import DropDownPicker, { optionsType } from '~components/DropDownPicker'
import { useForm } from 'react-hook-form'
import { useGetCompanies, useSwitchCompany } from '~api/general'
import LoaderScreen from '~components/LoaderScreen'
import { isEmpty, isNil } from 'lodash'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import SubmitButton from '~components/buttons/SubmitButton'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'

interface Props {
  navigation: MainNavigationProp<AccountsRoutes.SwitchCompany>
  route: MainNavigationRouteProp<AccountsRoutes.SwitchCompany>
}

const SwitchCompany = ({ navigation }: Props) => {
  const { data, isLoading } = useGetCompanies()
  const {
    user: { company_id: auth_company_id },
  } = useSelector((state: State) => state.user)
  const { t } = useTranslation('account')
  const { control, watch, handleSubmit } = useForm()
  const [companyOpen, setCompanyOpen] = useState(false)
  const [company, setCompany] = useState('')
  const [companyOptions, setCompanyItems] = useState<optionsType[]>()
  const [branchOpen, setBranchOpen] = useState(false)
  const [branch, setBranch] = useState('')
  const [branchOptions, setBranchOptions] = useState<optionsType[]>()
  const selectedCompany = watch('selected_company_id')
  const companyRef = useRef(true)
  const companies = data?.data?.data?.data ?? []
  const [authedBranches, setAuthedBranches] = useState<any>([])
  const { mutate, isLoading: loading } = useSwitchCompany()

  useStatusBarBackgroundColor('white')

  useEffect(() => {
    if (companyRef.current) {
      companyRef.current = false
    } else {
      try {
        const selectedCompanyBranches = !isEmpty(companies)
          ? handleGetCompanyBranches(selectedCompany)
          : []
        setAuthedBranches(selectedCompanyBranches)
      } catch (error) {
        setAuthedBranches([])
      }
    }
  }, [selectedCompany])

  const companyItems = useMemo(
    () =>
      !isEmpty(companies)
        ? companies.map(({ name: label, id: value, ...rest }) => ({
            label,
            value,
            ...rest,
          }))
        : [],
    [companies],
  )

  const handleGetCompanyBranches = (companyId: any) => {
    const myCompany = isNil(companyId) ? auth_company_id : companyId
    return companies
      .filter((company: { id: any }) => company.id === myCompany)[0]
      .branches.map(({ name: label, id: value }) => ({
        label,
        value,
      }))
  }

  const company_branches = [
    { label: 'Head Office', value: '1' },
    ...authedBranches,
  ]

  const onSubmit = (data: { selected_company_id: any; id: string }) => {
    analyticsTrackEvent(AnalyticsEvents.Accounts.switch_company, {})
    let companyID
    if (isNil(data.selected_company_id)) {
      companyID = auth_company_id
    } else {
      companyID = data.selected_company_id
    }

    const payload = {
      // ...values,
      id: data.id === '1' || isNil(data.id) ? companyID : data.id,
    }

    mutate(payload, {
      onSuccess: () => {
        navigation.navigate('HomeTabNavigator', { screen: 'Home' })
        analyticsTrackEvent(AnalyticsEvents.Accounts.switch_company_success, {})
      },
    })
  }

  if (isLoading) return <LoaderScreen />

  return (
    <Box flex={1} safeArea background="white" paddingX="16px">
      <ScreenHeader
        onPress={() => navigation.goBack()}
        title={t('switchCompany')}
      />
      <ScrollView flex={1}>
        <Box mt={'24px'} />
        <Text fontSize="14px" color="grey" fontFamily="body" mb="5px">
          Company
        </Text>
        <DropDownPicker
          control={control}
          value={company}
          open={companyOpen}
          options={companyItems}
          setOptions={setCompanyItems}
          setValue={setCompany}
          setOpen={setCompanyOpen}
          rules={{
            required: { value: true, message: 'Company is required' },
          }}
          name="selected_company_id"
          zIndex={3000}
        />
        <Box h={'20px'} />
        <Text fontSize="14px" color="grey" fontFamily="body" mb="5px">
          Branch
        </Text>
        <DropDownPicker
          control={control}
          value={branch}
          open={branchOpen}
          options={company_branches}
          setOptions={setBranchOptions}
          setValue={setBranch}
          setOpen={setBranchOpen}
          rules={{
            required: { value: true, message: 'Company is required' },
          }}
          name="id"
          zIndex={2000}
        />
        <Box h={'200px'} />
      </ScrollView>
      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        title={t('switchCompany')}
        loading={loading}
      />
    </Box>
  )
}

export default SwitchCompany
