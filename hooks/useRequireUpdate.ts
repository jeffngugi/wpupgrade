import VersionCheck from 'react-native-version-check'
import { useEffect, useState } from 'react'

export const useRequireUpdate = () => {
  const [requireUpdate, setRequireUpdate] = useState(false)

  useEffect(() => {
    const checkVersion = async () => {
      const currentVersion = await VersionCheck.getCurrentVersion()
      const latestVersion = await VersionCheck.getLatestVersion()
      const res = await VersionCheck.needUpdate({
        currentVersion,
        latestVersion,
        depth: 3,
      })

      if (!res || !res.isNeeded) {
        return
      }
      setRequireUpdate(res.isNeeded)
    }

    checkVersion()
  }, [])
  return requireUpdate
}
