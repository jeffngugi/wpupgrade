import { useEffect, useState } from 'react'
import {
  getUniqueId,
  getManufacturer,
  getVersion,
  getBuildNumber,
} from 'react-native-device-info'
import {
  getFcmToken,
  notificationListener,
  requestUserPermission,
} from './notifications'
import { isIos } from '~utils/platforms'
import { useFetchProfile } from '~api/home'
import axios from 'axios'

export type TFCMData = {
  mobile: string
  email: string
  device: string
  device_id: string
  app_version_code: string
  app_version_name: string | number
  token: string
  package_name: 'ke.co.workpay' | 'com.workpay.workpay'
  is_employee?: boolean
  is_admin?: boolean
}

export const useNotifications = () => {
  const { data: profileData } = useFetchProfile()
  const [generatedToken, setGeneratedToken] = useState<string>()

  const createFCMToken = async (generatedToken: string) => {
    const device_id = await getUniqueId()
    const manufacturer = await getManufacturer()
    const version = 'V' + getVersion()
    const buildNumber = getBuildNumber()

    const data: TFCMData = {
      mobile: profileData?.data?.address_email || '',
      email: profileData?.data?.mobile_no || '',
      device: manufacturer,
      device_id: device_id,
      app_version_code: buildNumber,
      app_version_name: version,
      token: generatedToken,
      package_name: isIos ? 'ke.co.workpay' : 'com.workpay.workpay',
      is_employee: true,
    }
    axios
      .post('https://mobilepush.workpay.co.ke/api/cloud/register/device', data)
      .then(data => console.log('Data dsdsd', data))
  }

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getFcmToken()
      if (token) {
        setGeneratedToken(token)
      }
    }
    void fetchToken()
    void requestUserPermission()
    void notificationListener()
  }, [generatedToken])

  /**
   * The following useEffect code is commented out to ensure we do not register new devices in out notification server
   * We will uncomment it once the server is rectified and works as expected
   */

  // useEffect(() => {
  //   if (generatedToken) {
  //     createFCMToken(generatedToken)
  //   }
  // }, [generatedToken])
}
