import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import CommonInput from '../../components/inputs/CommonInput'
import { Text, Box, Button, ScrollView } from 'native-base'
import TextAreaInput from '../../components/inputs/TextAreaInput'
import SampleForm from './SampleForm'
import LoadingModal from '../../components/modals/LoadingModal'
import CommonModal from '../../components/modals/CommonModal'
import DocumentButton from '../../components/buttons/DocumentBtn'
import SwipableModal from '../../components/modals/SwipableModal'
import EmptyState from '../../components/empty-state/EmptyState'
import PaySlipIcon from '../../assets/svg/payslip.svg'
import DocumentPickerModal from '../../components/modals/DocumentPickerModal'
import { fileUploadType } from '../../components/modals/types'
import DateInput from '../../components/date/DateInput'
import SuccessModal from '../../components/modals/SuccessModal'
import DeleteModal from '../../components/modals/DeleteModal'
import EwaIcon from '../../assets/svg/expenses.svg'
import { AppModules } from '../../types'
import DropDownPicker from '~components/DropDownPicker'
import PhoneNumberInput from '~components/inputs/PhoneNumberInput'
import { useTranslation } from 'react-i18next'

const BaseComponents = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [language, setLanguage] = useState('')
  const handleSetFile = (file?: fileUploadType) => {
    console.log('This will try to set file')
  }
  const { t } = useTranslation('playground')
  return (
    <Box flex={1} backgroundColor="white" safeArea>
      <Text>{t('title')}</Text>
      <Text>Design V 4.2.03</Text>
    </Box>
  )
  return (
    <Box safeArea flex={1}>
      {/* <PhoneNumberInput /> */}
      {/* <ScrollView> */}
      {/* <TextAreaInput name='notes' placeholder='Start typing' label='Notes'/> */}
      {/* <LoadingModal isVisible={loading} message='Submiting leave ...'/> */}
      {/* <CommonModal isVisible={i}/> */}
      {/* <DeleteModal
        title="Delete leave application"
        description="Are you sure you want to delete your leave application?"
        onDelete={() => {}}
        isVisible={loading}
        hideModal={() => setLoading(false)}
      /> */}
      <SampleForm />
      {/* <Badge variant='success'>Success</Badge>
        <Badge variant='pending'>Pending</Badge>
        <Badge variant='failed'>Failed</Badge> */}
      {/* <Button onPress={() => setLoading(true)} variant="link">
        Click me
      </Button> */}
      {/* <EmptyState moduleName={AppModules.advances} /> */}
      {/* <DocumentButton label='Add Receipt' onPress={()=>setModalVisible(true)}/>
        <DocumentPickerModal
          onUserCanceled={() => setModalVisible(false)}
          isVisible={modalVisible}
          hideModal={() => setModalVisible(false)}
          onBackdropPress={() => setModalVisible(false)}
          showCamera
          allowFiles
          setFile={handleSetFile}
          setPhotoURI={uri => {
            if (!uri) return
            console.log('uriis herer', uri)
          }}
        />
        {/* <SuccessModal
          title='Application succesful'
          message='You will receive a notification when your salary advance is approved.'
          btnLabel='Review your application'
          isOpen={loading}
          onHide={() => setLoading(false)}
          onPressBtn={() => setLoading(false)} /> */}

      {/* <SwipableModal isOpen={loading} onHide={() => setLoading(false)}>
          <Text>This is jeff Ngugi</Text>
          <Button
            onPress={() => setLoading(false)}
            marginBottom="20px"
            marginX={'21px'}>
            close
          </Button>
        </SwipableModal> */}
      {/* <EmptyState
          title="You have no leaves yet"
          subTitle={`Apply for your leaves category and get ${'\n'} approved quickly`}
          Icon={PaySlipIcon}
        /> */}
      {/* </ScrollView> */}
    </Box>
  )
}

export default BaseComponents

const styles = StyleSheet.create({})
