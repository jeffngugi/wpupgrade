import React from 'react'
import { Badge, Text } from 'native-base'
import { statusMapper } from '../constants'

function LoanStatusFormatter({ status }: { status: string }) {
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
            fontFamily={'body'}
            fontSize={'12px'}
            // my="auto"
            key={`${idx + 1} ${item.lable}`}>
            {item.lable}
            {/* </Text> */}
          </Badge>
        ))}
    </>
  )
}

export function LoanStatusFormatterText(status: string) {
  const statuses = statusMapper
    .filter(currentStatus => currentStatus.identifier === status)
    .map((item, idx) => item.lable)

  return statuses
}

export default LoanStatusFormatter
