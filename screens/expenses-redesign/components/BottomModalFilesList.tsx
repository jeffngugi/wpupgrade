import { Dimensions, Pressable, StyleSheet } from 'react-native'
import React, { SetStateAction, useEffect } from 'react'
import Modal from 'react-native-modal'
import { Box, Button, HStack, Spinner, Text } from 'native-base'
import { SwipeableModalProps } from './types'
import { isEmpty } from 'lodash'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FileData } from '~screens/expenses/components/ExpenseForm'
import XIcon from '~assets/svg/x.svg'
import { FileScrollViewList } from './FileScrollViewList'


const height = Dimensions.get('window').height


type ModalProps = {
  title: string
  message: string
  btnLabel: string
  files: FileData[]
  currentFileIndex: number
  control: any
  onPressBtn: () => void
  editAmount?: string | null | number
  editClaimAmountHandler?: (amount: string, index: number) => void
  closeIcon?: boolean
  isEdit?: boolean
  receipts?: any[]
  setPrevReceipts: (newFiles: []) => void
  setFiles: (newFiles: []) => void
  handleEditClaimAmount?: (index: number) => void
  currencyCode?: string
  hasDelete?: boolean
  hasEdit?: boolean
} & SwipeableModalProps

export const SWIPEABLE_MODAL_OFFSET_TOP = 110
export const SWIPEABLE_MODAL_HEIGHT = height - SWIPEABLE_MODAL_OFFSET_TOP

const BottomModalFilesList = ({
  isOpen,
  onHide,
  onSwipeComplete,
  onBackdropPress,
  title,
  setFiles,
  files,
  currentFileIndex,
  onPressBtn,
  editAmount,
  closeIcon,
  isEdit,
  receipts,
  setPrevReceipts,
  editClaimAmountHandler,
  hasDelete,
  hasEdit,
  currencyCode,
  ...rest
}: ModalProps) => {


  return (
    <Modal
      statusBarTranslucent
      isVisible={isOpen}
      useNativeDriverForBackdrop
      // coverScreen
      zIndex={1000}
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
        keyboardShouldPersistTaps="handled"

      >
        <Box
          safeArea
          backgroundColor="white"
          paddingX={'24px'}
          marginX="0px"
          bottom={'0px'}
          zIndex={-1}
          borderRadius={'8px'}
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

            <FileScrollViewList
              files={files}
              setFiles={setFiles}
              receipts={receipts}
              setPrevReceipts={setPrevReceipts}
              handleEditClaimAmount={editClaimAmountHandler}
              hasDelete={hasDelete}
              hasEdit
              currencyCode={currencyCode}
              onHide={onHide}
            />
          </Box>
          <Button
            onPress={onPressBtn}
            mb={'32px'}
            mt={'16px'}
            w={'70%'}
            mx={'auto'}
            {...rest} >

            <Text fontFamily={'heading'} color={'white'} fontSize={'16px'}>
              Upload New File
            </Text>

          </Button>
        </Box>
      </KeyboardAwareScrollView>
    </Modal>
  )
}

export default BottomModalFilesList

const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  topOffset: {
    // marginTop: SWIPEABLE_MODAL_OFFSET_TOP,
  },
})
