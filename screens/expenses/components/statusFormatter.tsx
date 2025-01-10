import React from 'react'
import { Badge } from 'native-base'
import { statusMapper, utilityStatusMapper, verificationStatusMapper } from '../constants'
import { toLower } from 'lodash'

function ExpenseStatusFormatter({
  status,
  center,
}: {
  status: string
  center?: boolean
}) {
  return (
    <>
      {statusMapper
        .filter(currentStatus => currentStatus.identifier === status)
        .map((item, idx) => (
          <Badge
            size="sm"
            align="center"
            borderRadius="16px"
            px={'11px'}
            py={'2px'}
            bg={item.colorCode}
            color="#FFFFFF"
            key={`${idx + 1} ${item.lable}`}
            fontFamily={'body'}
            fontSize={'12px'}
            my={center ? 'auto' : '0'}>
            {item.lable}
          </Badge>
        ))}
    </>
  )
}

export function ExpenseStatusFormatterText(status) {
  const statuses = statusMapper
    .filter(currentStatus => currentStatus.identifier === status)
    .map((item, idx) => item.lable)

  return statuses
}

export function ExpenseUtilityStatusFormatter({
  status,
  center,
}: {
  status: string
  center?: boolean
}) {
  return (
    <>
      {utilityStatusMapper
        .filter(currentStatus => currentStatus.identifier === status)
        .map((item, idx) => (
          <Badge
            size="sm"
            align="center"
            borderRadius="16px"
            px={'11px'}
            py={'2px'}
            bg={item.colorCode}
            color="#FFFFFF"
            key={`${idx + 1} ${item.lable}`}
            _text={{
              color: item.textColorCode,
            }}
            fontFamily={'body'}
            fontSize={'12px'}
            my={center ? 'auto' : '0'}>
            {item.lable}
          </Badge>
        ))}
    </>
  )
}

export function ExpenseVerificationStatusFormatter({
  status,
  center,
}: {
  status: string
  center?: boolean
}) {

  return (
    verificationStatusMapper
      .filter(currentStatus => toLower(currentStatus.identifier) === toLower(status))
      .map((item, idx) => (
        <Badge
          size="sm"
          align="center"
          borderRadius="16px"
          px={'11px'}
          py={'2px'}
          bg={item.colorCode}
          color="#FFFFFF"
          key={`${idx + 1} ${item.lable}`}
          fontFamily={'body'}
          fontSize={'12px'}
          my={center ? 'auto' : '0'}>
          {item.lable}
        </Badge>
      ))

  )
}



export default ExpenseStatusFormatter
