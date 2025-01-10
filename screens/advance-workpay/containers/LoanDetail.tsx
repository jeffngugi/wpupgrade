import { Box, Text, Pressable, Divider, ScrollView } from 'native-base'
import React, { useState } from 'react'
import LoanDetailHero from '../components/LoanDetailHero'
import RefreshIcon from '~assets/svg/refresh.svg'
import ChevIcon from '~assets/svg/chev-right.svg'
import DetailItem from '~components/DetailItem'
import { LoanRoutes } from '~types'
import { formatDate } from '~utils/date'
import { currencyFormatter } from '~utils/app-utils'
import { useDeleteAdvanceLoan } from '~api/advance-loans'
import EditDelBtns from '~components/EditDelBtns'
import DeleteModal from '~components/modals/DeleteModal'
import { FileScrollView } from '~components/FilesScrollView'
import { noop } from 'lodash'

interface LoanDetailsProps {
  loanDetail: any
  navigation: any
  showDeleteModal?: boolean
  setShowDeleteModal?: any
}

const AdvanceLoanDetails = ({
  loanDetail,
  navigation,
  showDeleteModal,
  setShowDeleteModal,
}: LoanDetailsProps) => {
  const amountPaid =
    parseInt(loanDetail?.total_interest) -
    parseInt(loanDetail?.interest_balance)
  const currencyCode = loanDetail?.currency_code

  const [editing, setEditing] = useState(false)

  const toggleScreen = () => setEditing(!editing)
  const deleteAdvance = useDeleteAdvanceLoan()

  const proof_of_residence_receipt = {
    attachment: loanDetail?.proof_of_residence_link,
  }
  const financial_statement_receipt = {
    attachment: loanDetail?.financial_statement_link,
  }

  const handleDelete = () => {
    deleteAdvance.mutate(loanDetail?.id, {
      onSuccess: () => {
        setShowDeleteModal(false)
        navigation.goBack()
      },
      onError: () => {
        setShowDeleteModal(false)
      },
    })
  }

  const handleGoBack = () => {
    editing ? toggleScreen() : navigation.goBack()
  }

  const RightItem = () => (
    <EditDelBtns
      onPressDel={() => setShowDeleteModal(!showDeleteModal)}
      onPressEdit={toggleScreen}
    />
  )

  return (
    <Box flex={1} backgroundColor="white">
      <ScrollView flex={1}>
        <LoanDetailHero loanDetail={loanDetail} />
        <Pressable
          flexDirection="row"
          alignItems="center"
          mt="40px"
          mb="20px"
          onPress={() =>
            navigation.navigate(LoanRoutes.Schedule, {
              loanSchedule: loanDetail?.schedule,
              currencyCode,
            })
          }>
          <RefreshIcon color="#62A446" />
          <Text color="green.50" fontSize="18px" flex={1} ml="8px">
            Loan Amortization Schedule
          </Text>
          <ChevIcon color="#62A446" />
        </Pressable>
        <Divider />
        <DetailItem label={'Loan type'} value={loanDetail?.loan_type_type} />
        <DetailItem label={'Interest Rate'} value={loanDetail?.rate} />
        <DetailItem
          label={'Interest Amount Paid'}
          value={currencyFormatter(amountPaid, currencyCode)}
        />
        <DetailItem label={'Number Of Months'} value={loanDetail?.duration} />
        <DetailItem
          label={'Date Paid'}
          value={formatDate(loanDetail?.start_date, 'shortMonth')}
        />

        <Text mt="20px">Reason</Text>
        <Text color="charcoal" mb={'20px'}>
          {loanDetail?.reason}
        </Text>

        {loanDetail?.proof_of_residence_link ? (
          <>
            <Text mb="5px" mt={'12px'} color={'grey'}>
              Proof of Residence{' '}
            </Text>
            <Box mt="4px">
              <FileScrollView
                files={[]}
                receipts={[proof_of_residence_receipt]}
                setFiles={noop}
                setPrevReceipts={noop}
                hasDelete={false}
              />
            </Box>
          </>
        ) : null}
        {loanDetail?.proof_of_residence_link ? (
          <>
            <Text mb="5px" mt={'12px'} color={'grey'}>
              Financial Statement{' '}
            </Text>
            <Box mt="4px">
              <FileScrollView
                files={[]}
                receipts={[financial_statement_receipt]}
                setFiles={noop}
                setPrevReceipts={noop}
                hasDelete={false}
              />
            </Box>
          </>
        ) : null}

        <Box mb={'20px'} />
      </ScrollView>
      <DeleteModal
        title="Delete salary advance"
        description="Are you sure you want to delete your advance"
        onDelete={handleDelete}
        isVisible={showDeleteModal}
        btbLabel={'Delete'}
        hideModal={() => setShowDeleteModal(false)}
        loading={deleteAdvance.isLoading}
      />
    </Box>
  )
}

export default AdvanceLoanDetails
