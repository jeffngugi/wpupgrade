import { useNavigation } from '@react-navigation/native'
import { Box, Pressable, Text, Divider, Menu, Badge, HStack } from 'native-base'
import React, { useState } from 'react'
import { PayslipCardProps } from '~types'
import MoreIcon from '~assets/svg/more-vertical.svg'
import ConfirmModal from '~components/modals/ConfirmModal'
import { useExportP9Report } from '~api/p9Forms'
import { WPBTOA } from '~utils/appUtils'
import { getAuthParams } from '~helpers/authHelper'
import { setYear } from 'date-fns'
import SuccessModal from '~components/modals/SuccessModal'
import LoadingModal from '~components/modals/LoadingModal'
import { isEmpty } from 'lodash'

const P9FormCard = ({
  date,
  amount,
  showAmount,
  year,
}: PayslipCardProps & { year: string }) => {
  useNavigation()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [currentAction, setCurrentAction] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const { data, error, isLoading, mutate, reset } = useExportP9Report()

  async function onSubmit() {
    setShowConfirmModal(false)
    const employeeDetails = await getAuthParams()
    const employeeIds = employeeDetails?.auth_employee_id
    const AUTH_COMPANY_ID = employeeDetails?.auth_company_id
    const type = 'pdf'

    const encodedEmployeeIds = WPBTOA(employeeIds)

    const forDownload = currentAction === 'download' ? '?for_download=1' : ''
    const payload = `${encodedEmployeeIds}/${year}/${AUTH_COMPANY_ID}/${type}${forDownload}`
    reset()
    mutate(payload, {
      onSettled(data) {
        const filePath = data?.data?.file_path
        const message =
          currentAction === 'download'
            ? `P9 Form successfully downloaded here ${filePath ?? ''}`
            : 'P9 form will be emailed shortly'
        setSubmitMessage(message)

        requestAnimationFrame(() => setShowSuccessModal(true))
      },
    })
  }

  const RightItem = () => (
    <Menu
      w="190"
      defaultIsOpen={false}
      trigger={triggerProps => {
        return (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <MoreIcon color="#253545" />
          </Pressable>
        )
      }}>
      <Menu.Item
        onPress={() => {
          setShowConfirmModal(true)
          setCurrentAction('email')
        }}>
        <Text fontFamily={'body'} fontSize={'16px'}>
          Email myself
        </Text>
      </Menu.Item>
      <Menu.Item
        onPress={() => {
          setShowConfirmModal(true)
          setCurrentAction('download')
        }}>
        <Text fontFamily={'body'} fontSize={'16px'}>
          Download P9 Form
        </Text>
      </Menu.Item>
    </Menu>
  )

  return (
    <Pressable
      onPress={() => {
        setYear
      }}>
      <Pressable flexDirection="row" justifyContent="space-between" my={'24px'}>
        <Box>
          <HStack>
            <Text fontSize={'16px'} fontFamily={'body'} color={'grey'}>
              Gross
            </Text>
            <Badge variant="success" status={date ?? '-'} ml="13px">
              {date}
            </Badge>
          </HStack>
          <Box>
            <Text
              fontSize="20px"
              color={showAmount ? 'charcoal' : 'transparent'}>
              {amount ?? '-'}
            </Text>
            <Box
              top={0}
              right={0}
              left={0}
              bottom={0}
              position="absolute"
              borderRadius={20}
              shadow={showAmount ? 100 : 9}
              backgroundColor={showAmount ? 'transparent' : '#53617010'}
            />
          </Box>
        </Box>
        <RightItem />
      </Pressable>
      <Divider />
      <ConfirmModal
        isVisible={showConfirmModal}
        hideModal={() => setShowConfirmModal(false)}
        title={`${
          currentAction == 'download'
            ? 'Download P9 Form'
            : 'Email P9 Form to yourself'
        }`}
        description={'Are you sure you want to proceed?'}
        onConfirm={onSubmit}
        btbLabel={'Confirm'}
        closeIcon={true}
        loading={false}
      />
      <SuccessModal
        title="Success"
        message={isEmpty(submitMessage) ? 'Request successful' : submitMessage}
        btnLabel="Back to module"
        onPressBtn={() => {
          setShowSuccessModal(false)
        }}
        isOpen={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
      />
      <LoadingModal message="Processing " isVisible={isLoading} />
    </Pressable>
  )
}

export default P9FormCard
