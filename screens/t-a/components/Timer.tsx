import { differenceInSeconds, intervalToDuration } from 'date-fns'
import { isUndefined, maxBy } from 'lodash'
import { Heading } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ClockInOut, State } from '~declarations'
import { formatFromWPDate, isToday } from '~utils/date'

const Timer = React.memo(function Timer() {
  const { clockInsOuts } = useSelector((state: State) => state.ta)
  const attempts: ClockInOut[] = clockInsOuts ?? []

  const minDigits = {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }
  const calculateTimeIn = () => {
    let timeSinceLastClockIn = '00:00:00'
    if (attempts.length > 0) {
      const latestAttempt = maxBy(attempts, 'id')
      if (latestAttempt?.time_in) {
        timeSinceLastClockIn = '00:00:00'
        const lastClockIn = formatFromWPDate(latestAttempt.time_in)
        if (!isUndefined(lastClockIn) && isToday(lastClockIn)) {
          const tSeconds = differenceInSeconds(lastClockIn, new Date())
          const duration = intervalToDuration({
            start: 0,
            end: tSeconds * 1000,
          })
          timeSinceLastClockIn =
            `${duration.hours?.toLocaleString(
              'en-US',
              minDigits,
            )}:${duration.minutes?.toLocaleString(
              'en-US',
              minDigits,
            )}:${duration.seconds?.toLocaleString('en-US', minDigits)}` ??
            '00:00:00'
        }
      }
    }

    return timeSinceLastClockIn
  }

  const [timeIn, setTimeIn] = useState(calculateTimeIn())
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeIn(calculateTimeIn())
    }, 1000)
    return () => clearTimeout(timer)
  })
  return (
    <Heading alignSelf="center" mt="24px" fontSize={'24px'}>
      {timeIn}
    </Heading>
  )
})

export default Timer
