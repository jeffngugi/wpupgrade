import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ClockInOut } from '~declarations'
import { addAttempts } from '~store/actions/TA'
import { getClockAttemptsFromDb } from '~utils/database/queries/clockAttempts'

const useGetClockAttempts = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [clockAttempts, setClockAttempts] = useState<ClockInOut[]>([])
  const [error, setError] = useState<string>()

  const getAttempts = async () => {
    try {
      const res = await getClockAttemptsFromDb()
      setClockAttempts(res)
      dispatch(addAttempts(res))
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getAttempts()
  }, [])

  const refetchAttempts = () => {
    getAttempts()
  }
  return {
    isLoading,
    clockAttempts,
    error,
    refetchAttempts,
  }
}

export default useGetClockAttempts
