import { Box, Divider, HStack, Text } from 'native-base'
import React from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import CompanyIcon from '../../assets/svg/company.svg'
import { useMyProfile } from '~api/account'
import { useFetchProfile } from '~api/home'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import { dateToString } from '~utils/date'

const EmployementDetailScreen = ({ navigation }: { navigation: any }) => {
  const { data } = useMyProfile()
  const { data: profileData } = useFetchProfile()
  const datas = [
    {
      label: 'Branch',
      value: data?.data?.branch_name ?? '-',
    },
    {
      label: 'Department',
      value: data?.data?.department_name ?? '-',
    },
    {
      label: 'Job Title',
      value: data?.data?.designation_name ?? '-',
    },
    {
      label: 'Reports to',
      value: data?.data?.supervisor_name ?? '-',
    },
    {
      label: 'Employee No',
      value: data?.data?.employee_no ?? '-',
    },
    {
      label: 'Employment Date',
      value: data?.data?.date_employed ?? '-',
    },
  ]

  useStatusBarBackgroundColor('white')

  return (
    <Box safeArea paddingX="16px" backgroundColor="white" flex={1}>
      <ScreenHeader
        title="Employment Details"
        onPress={() => navigation.goBack()}
      />
      <HStack alignItems="center" mt={'40px'}>
        <Box>
          <CompanyIcon width={24} height={24} />
        </Box>
        <Box>
          <Text
            color="charcoal"
            fontSize="20px"
            lineHeight={'24px'}
            marginLeft="8px"
            background={'yellow.200'}>
            {profileData?.data?.company_name ?? '-'}
          </Text>
        </Box>
      </HStack>
      {datas.map((item, index) => {
        return (
          <Box key={index.toString()}>
            <HStack justifyContent="space-between" marginY="20px">
              <Text fontSize="14px" color="grey">
                {item.label}
              </Text>
              <Text
                fontSize="16px"
                color={item.label === 'Reports to' ? 'green.50' : 'charcoal'}>
                {item.label === 'Employment Date'
                  ? dateToString(item.value, 'do MMM, yyyy')
                  : item.value}
              </Text>
            </HStack>
            <Divider />
          </Box>
        )
      })}
    </Box>
  )
}

export default EmployementDetailScreen
