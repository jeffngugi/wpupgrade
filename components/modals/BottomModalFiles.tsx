import { Dimensions, Pressable, StyleSheet } from 'react-native'
import React, { SetStateAction, useEffect } from 'react'
import Modal from 'react-native-modal'
import { Box, HStack, Text } from 'native-base'
import { SwipeableModalProps } from './types'
import DocumentPlaceHolder from '~screens/document/components/DocumentPlaceHolder'
import { isEmpty } from 'lodash'
import CommonInputSubmit from '~components/inputs/CommonInputSubmit'
import { useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FileData } from '~screens/expenses/components/ExpenseForm'
import XIcon from '~assets/svg/x.svg'
import { getFileNameFromUrl } from '~components/FilesScrollView'

const height = Dimensions.get('window').height

type ModalProps = {
  title: string
  message: string
  btnLabel: string
  files: FileData[]
  currentFileIndex: number
  control: any
  setFiles: React.Dispatch<SetStateAction<FileData[]>>
  onPressBtn: () => void
  editAmount?: string | null | number
  closeIcon?: boolean
  isEdit?: boolean
  prevReceipts?: any[]
  setPrevReceipts?: React.Dispatch<SetStateAction<any[]>>
} & SwipeableModalProps

export const SWIPEABLE_MODAL_OFFSET_TOP = 110
export const SWIPEABLE_MODAL_HEIGHT = height - SWIPEABLE_MODAL_OFFSET_TOP

const BottomModalFiles = ({
  isOpen,
  onHide,
  onSwipeComplete,
  onBackdropPress,
  title,
  setFiles,
  files,
  currentFileIndex,
  editAmount,
  closeIcon,
  isEdit,
  prevReceipts,
  setPrevReceipts,
  ...rest
}: ModalProps) => {
  const { control, watch, handleSubmit, setValue } = useForm()
  const amount = watch('amount')

  useEffect(() => {
    if (isEdit && prevReceipts?.[currentFileIndex] && amount) {
      const updatedReceipts = [...prevReceipts]
      const receipt = updatedReceipts[currentFileIndex]
      receipt.amount = amount
      setPrevReceipts?.(updatedReceipts)
    }
    else if (files[currentFileIndex] && amount) {
      const updatedFiles = [...files] // Create a copy of the files array
      const file = updatedFiles[currentFileIndex] // Get the specific file object to update

      file.amount = amount // Update the amount property of the file object

      // Update the state array with the updatedFiles
      // Assuming you have a setState function to update the state array, use it as:
      setFiles(updatedFiles)
    }

  }, [amount])

  useEffect(() => {
    if (editAmount) {
      setValue('amount', editAmount)
    }
  }, [editAmount])

  const handleClose = () => {
    const updatedFiles = [...files] // Create a copy of the files array]
    updatedFiles.splice(currentFileIndex, 1)
    setFiles(updatedFiles)
    onHide()
  }
  const submitValue = () => {
    onHide()
    setValue('amount', '')
  }

  return (
    <Modal
      statusBarTranslucent
      isVisible={isOpen}
      useNativeDriverForBackdrop
      coverScreen
      hideModalContentWhileAnimating
      backdropColor={'#1C1C1C50'}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={[styles.container]}
      animationInTiming={300}
      animationOutTiming={300}
      onModalHide={() => {
        onHide()
      }}
      onSwipeComplete={() => {
        onSwipeComplete?.()
      }}
      onBackdropPress={() => {
        onBackdropPress?.()
      }}
      {...rest}>
      <KeyboardAwareScrollView
        enableOnAndroid
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        keyboardShouldPersistTaps="handled">
        <Box
          safeArea
          backgroundColor="white"
          paddingX={'24px'}
          marginX="0px"
          bottom={'0px'}
          borderBottomColor={'red.10'}>
          <HStack justifyContent={'space-between'} alignItems={'center'}>
            <Text fontFamily={'heading'} color="charcoal" fontSize="20px">
              {title}
            </Text>
            {closeIcon ? (
              <Pressable onPress={onHide} ml={'auto'}>
                <XIcon color="#061938" width={24} height={24} />
              </Pressable>
            ) : null}
          </HStack>
          <Box mt="40px" mb={'30px'}>
            {!isEmpty(files) && (
              <DocumentPlaceHolder
                name={files[currentFileIndex]?.name}
                close
                onClose={handleClose}
              />
            )}
            {
              isEdit && !isEmpty(prevReceipts) && (
                <DocumentPlaceHolder
                  name={getFileNameFromUrl(prevReceipts?.[currentFileIndex]?.attachment) ?? ''}
                  close
                  onClose={handleClose}
                />
              )


            }
          </Box>
          <CommonInputSubmit
            name="amount"
            control={control}
            keyboardType="number-pad"
            placeholder="Enter claim amount"
            label="Amount"
            rules={{
              required: { value: true, message: 'Claim amount is required' },
            }}
            submitValue={handleSubmit(submitValue)}
            mb={'20px'}
          />
        </Box>
      </KeyboardAwareScrollView>
    </Modal>
  )
}

export default BottomModalFiles

const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  topOffset: {
    // marginTop: SWIPEABLE_MODAL_OFFSET_TOP,
  },
})
