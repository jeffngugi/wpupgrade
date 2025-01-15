import { Button, HStack, Text } from 'native-base'
import React, { useState } from 'react'
import * as SQLite from 'expo-sqlite/legacy'
import { Dimensions, Linking, Platform } from 'react-native'
import { useSelector } from 'react-redux'
import ScanQRCode from '~components/ScanQRCode'
import { ClockInOut, State } from '~declarations'
import { randomId } from '~utils/appUtils'
import { dateToString } from '~utils/date'
import { useLocation } from '~hooks/useLocation'
import { createAttemptQuery } from '~utils/database/queries/clockAttempts'
import { txnErrorCallback } from '~utils/database/database'
import { DB_NAME } from '~utils/appConstants'
import useGetClockAttempts from '~utils/hooks/useGetClockAttempts'
import { useAccountSettings } from '~api/settings'
import TAStatusModal from '~components/modals/TAStatusModal'
import { isNull, noop } from 'lodash'
import WarningModal from '~components/modals/WarningModal'
import { isAndroid } from '~utils/platforms'
import useAutoDate from '~hooks/useAutoDate'
import LoadingModal from '~components/modals/LoadingModal'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import ConfirmModal from '~components/modals/ConfirmModal'
import { requestCameraPermission } from '~utils/cameraPermission'
const { height } = Dimensions.get('screen')
export type TQRDATA = {
  checkpoint: null | number
  company_id: null | number
  project_id: null | number
  supervisor_id: null | number
}

const ClockInOutBtns = () => {
  const { autoDate } = useAutoDate()
  const [visible, setVisible] = useState(false)
  const [clockingIn, setClockingIn] = useState(true)
  const { data } = useAccountSettings()
  const [statusModal, setStatusModal] = useState(false)
  const [warning, setWarning] = useState(false)
  const [locationWarning, setLocationWarning] = useState(false)
  const [actionStatus, setActionStatus] = useState<
    'success' | 'failed' | 'loading' | undefined
  >(undefined)
  const [taDescription, setTaDescription] = useState('')

  const [qrCodeData, setQrCodeData] = useState<TQRDATA>({
    checkpoint: null,
    company_id: null,
    project_id: null,
    supervisor_id: null,
  })
  const db = SQLite.openDatabase(DB_NAME)
  const {
    user: { employee_id, company_id },
  } = useSelector((state: State) => state.user)
  const usesQR = data?.data?.clockin_mode === 'Qr_code'
  const { requestPosition, requestLocationPermission } = useLocation()
  const { refetchAttempts } = useGetClockAttempts()

  //Tech debt to improve. Refactor and write below as a hook or as a util function
  const createAttempt = (item: ClockInOut) => {
    db.transaction(tx => {
      tx.executeSql(
        createAttemptQuery,
        [
          item.clockId,
          item.company_id,
          item.employee_id,
          item.latitude,
          item.longitude,
          item.submitted,
          item.expireAt,
          item.status,
          item.message,
          item.time_in || null,
          item.time_out || null,
          item.check_point || null,
          item.address || null,
          item.detection_mode,
          item.project_id || null,
          item.supervisor_id || null,
          item.qr_code_company_id || null,
        ],
        () => {
          setActionStatus('success')
          setTaDescription(
            `${usesQR ? 'QR' : ''} ${
              item.clock_in ? 'clock in' : 'clock out'
            } successful`,
          )
          setStatusModal(true)
          refetchAttempts()
        },
        txnErrorCallback,
      )
    })
  }

  const handleClockInOut = async (clockIn: boolean) => {
    if(isAndroid && usesQR){
      await requestCameraPermission()
    }
    
    analyticsTrackEvent(
      clockIn ? AnalyticsEvents.Home.clock_in : AnalyticsEvents.Home.clock_out,
      {},
    )
    if (isAndroid && !autoDate) {
      setWarning(true)
      return
    }
    if (usesQR) {
      setVisible(true)
    }
    setActionStatus('loading')
    const permission = await requestLocationPermission()

    if (!permission && isAndroid) {
      setActionStatus('failed')
      setLocationWarning(true)
      return 'Location permision denied'
    }

    const position = await requestPosition()
    if (!position) {
      setActionStatus('failed')
      return 'Location permision denied'
    }
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude

    const clockinout: ClockInOut = {
      address: '',
      clockId: randomId(16),
      employee_id: employee_id,
      company_id: company_id as string,
      latitude,
      longitude,
      submitted: 0,
      expireAt: new Date().toISOString(),
      status: 'pending',
      message: '',
      detection_mode: 'EASY',
      ...(clockIn && {
        time_in: dateToString(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      }),
      ...(!clockIn && {
        time_out: dateToString(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      }),
      supervisor_id: '',
      ...(usesQR && {
        qr_code_company_id: '',
      }),
    }
    clockinout.clock_in = clockIn
    if (usesQR) {
      if (isNull(qrCodeData.company_id) && isNull(qrCodeData.checkpoint)) {
        setActionStatus('failed')
        setTaDescription(`QR ${clockIn ? 'clock in' : 'clock out'} failed`)
        setStatusModal(true)
      } else {
        setClockingIn(clockIn)
        clockinout.detection_mode = 'Qr_code'
        clockinout.check_point = qrCodeData.checkpoint
        clockinout.qr_code_company_id = qrCodeData.company_id
        clockinout.supervisor_id = 0
        clockinout.project_id = qrCodeData.project_id
        clockinout.clock_in = clockIn
        requestAnimationFrame(() => createAttempt(clockinout))
      }
    } else {
      setStatusModal(true)
      createAttempt(clockinout)
    }
  }

  const handleGrantPermission = async () => {
    setLocationWarning(false)
    await Linking.openSettings()
  }

  return (
    <>
      <HStack justifyContent="space-between" mb={height * 0.01}>
        <Button
          height={'45px'}
          backgroundColor="white"
          width="46%"
          onPress={() => handleClockInOut(true)}
          shadow={1}>
          <Text color="green.50">Clock In</Text>
        </Button>
        <Button
          height={'45px'}
          width="46%"
          shadow={1}
          onPress={() => handleClockInOut(false)}>
          <Text color="white">Clock Out</Text>
        </Button>
      </HStack>
      <ScanQRCode
        visible={visible}
        setVisible={() => setVisible(!visible)}
        setQrCodeData={setQrCodeData}
        clockIn={clockingIn}
      />

      <TAStatusModal
        closeIcon
        action={actionStatus}
        usesQR={usesQR}
        description={taDescription}
        onDelete={noop}
        isVisible={statusModal && !visible}
        hideModal={() => {
          setStatusModal(false)
        }}
      />
      <WarningModal
        title="Enable Automatic Time Detection"
        description="To ensure accurate clock-in and clock-out times, please enable automatic time detection on your device. Incorrect date and time settings can lead to discrepancies in your attendance report."
        isVisible={warning}
        hideModal={() => setWarning(false)}
      />

      <ConfirmModal
        title="Enable Location Permission"
        description={`To ensure accurate clock-in and clock-out times, it's important to grant location permission for WorkPay on your device. This allows the app to accurately record your work location and prevents discrepancies in your attendance report. Please follow the steps below to enable location permission:

1. Open your device's settings.
2. Navigate to 'App Permissions' or 'Application Settings.'
3. Find and select 'WorkPay.'
4. Enable 'Location' permission.

Granting location permission ensures a seamless experience and helps you make the most out of WorkPay's features. If you have any questions or need assistance, feel free to reach out. Thank you for using WorkPay!`}
        isVisible={locationWarning}
        hideModal={() => setLocationWarning(false)}
        onConfirm={handleGrantPermission}
        btbLabel="Open Settings"
      />
    </>
  )
}

export default ClockInOutBtns
