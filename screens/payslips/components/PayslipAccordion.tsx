import { Box, Pressable, Text, HStack, Heading } from 'native-base'
import { ColorType } from 'native-base/lib/typescript/components/types'
import React, { useState } from 'react'
import ChevDown from '../../../assets/svg/chev-down.svg'
import ChevUp from '../../../assets/svg/chev-up.svg'

type PayslipAccordionProps = {
  title: string
  total: string | number
  borderColor: ColorType
  bgColor: ColorType
  childData: React.ReactNode
}

const PayslipAccordion = ({
  title,
  total,
  borderColor,
  bgColor,
  childData,
}: PayslipAccordionProps) => {
  const [expanded, setExpanded] = useState<boolean>(false)

  const handleToggle = () => {
    setExpanded(!expanded)
  }
  return (
    <Box
      borderWidth="1px"
      borderRadius="4px"
      borderColor={borderColor}
      backgroundColor={bgColor}>
      <Pressable
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingY="14px"
        marginX="20px"
        onPress={handleToggle}>
        <Text color="charcoal" fontSize="18px">
          {title}
        </Text>
        {expanded ? <ChevUp color="#253545" /> : <ChevDown color="#253545" />}
      </Pressable>
      {expanded ? <>{childData}</> : null}

      <HStack
        justifyContent="space-between"
        paddingY="10px"
        paddingX="20px"
        backgroundColor={borderColor}>
        <Text fontSize="16px" color={'grey'}>
          Total
        </Text>
        <Heading fontSize="16px" color="charcoal">
          {total}
        </Heading>
      </HStack>
    </Box>
  )
}

export default PayslipAccordion
