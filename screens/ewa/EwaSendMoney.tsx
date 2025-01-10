/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box } from 'native-base'
import React, { useEffect } from 'react'
import { Control, FieldValues, useForm } from 'react-hook-form'
import ScreenHeader from '~components/ScreenHeader'
import {
  EwaRoutes,
  EwaSendMethods,
  MainNavigationProp,
  MainNavigationRouteProp,
  TEwaSubmitData,
} from '~types'
import EwaBank from './sendMoney/EwaBank'
import EwaMpesa from './sendMoney/EwaMpesa'
import { useTranslation } from 'react-i18next'
import { useEwaCharges } from '~api/ewa'
import { useMyProfile } from '~api/account'
import SubmitButton from '~components/buttons/SubmitButton'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents, AnalyticsEventsTypes } from '~utils/analytics/events'
import { Ewa } from '~utils/analytics/events/ewa'
import EWAWallet from './sendMoney/EWAWallet'

export type EwaFormProps = {
  control: Control<FieldValues, object>
}

interface Props {
  navigation: MainNavigationProp<EwaRoutes.SendMoney>
  route: MainNavigationRouteProp<EwaRoutes.SendMoney>
}

type FormValues = Omit<TEwaSubmitData, 'currency_id' | 'payment_method'>

const EwaSendMoney = ({ route, navigation }: Props) => {
  const { t } = useTranslation('ewa')
  const { control, setValue, handleSubmit } = useForm()
  const { mutate, isLoading } = useEwaCharges()
  const emp = useMyProfile()
  const { params } = route
  let headerTitle = ''
  let ewaAnalyticsEvent: AnalyticsEventsTypes
  let event: keyof typeof Ewa | '' = ''
  if (params.ewaSendMethod === EwaSendMethods.mpesa) {
    headerTitle = t('sendToMpesa')
    event = 'send_to_mpesa'
  } else if (params.ewaSendMethod === EwaSendMethods.bank) {
    headerTitle = t('sendToBank')
  } else if (params.ewaSendMethod === EwaSendMethods.wallet) {
    headerTitle = t('sendToWallet')
  }
  useEffect(() => {
    analyticsTrackEvent(ewaAnalyticsEvent, {})
  }, [])

  const currencyId = emp?.data?.data?.currency_id

  const handleToReview = (data: FormValues) => {
    if (event !== '') {
      analyticsTrackEvent(AnalyticsEvents.Ewa[event], {})
    }
    const submitData: TEwaSubmitData = {
      ...data,
      currency_id: currencyId,
      payment_method: params.ewaSendMethod,
    }
    mutate(submitData, {
      onSuccess: data => {
        navigation.navigate(EwaRoutes.EwaReview, {
          chargesData: data?.data,
          submitData,
        })
        const successEvent: keyof typeof Ewa = `${
          event + '_success'
        }` as keyof typeof Ewa
        analyticsTrackEvent(AnalyticsEvents.Ewa[successEvent], {})
      },
    })
  }

  return (
    <Box safeArea flex={1} backgroundColor="white" paddingX="16px">
      <ScreenHeader title={headerTitle} onPress={() => navigation.goBack()} />

      <Box mt={'24px'}></Box>

      {(() => {
        switch (params.ewaSendMethod) {
          case EwaSendMethods.mpesa:
            return (
              <EwaMpesa
                control={control}
                setValue={setValue}
                item={params?.item}
              />
            )
          case EwaSendMethods.wallet:
            return <EWAWallet control={control} />
          default:
            return (
              <EwaBank
                control={control}
                setValue={setValue}
                item={params?.item}
              />
            )
        }
      })()}
      {/* 
        // @ts-ignore */}
      <SubmitButton
        loading={isLoading}
        onPress={handleSubmit(handleToReview)}
        title={t('continue')}
      />
    </Box>
  )
}

export default EwaSendMoney
