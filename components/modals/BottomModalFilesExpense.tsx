import { Dimensions, StyleSheet } from 'react-native'
import React, { SetStateAction, useEffect, useRef } from 'react'
import Modal from 'react-native-modal'
import { Box, Button, Center, HStack, Spinner, Text, VStack, Pressable } from 'native-base'
import { SwipeableModalProps } from './types'
import { isEmpty, isUndefined, set } from 'lodash'
import { useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FileData } from '~screens/expenses/components/ExpenseForm'
import XIcon from '~assets/svg/x.svg'
import { getFileNameFromUrl } from '~components/FilesScrollView'
import DocumentPlaceHolder from '~screens/expenses-redesign/components/DocumentPlaceHolder'
import CommonInputCurrency from '~components/inputs/CommonInputCurrency'
import FileUploadButton from '~screens/expenses-redesign/components/FileUploadButton'

import LoadingModal from '~components/modals/LoadingModal'
import { fileTypes } from '~screens/expenses-redesign/components/FileScrollViewList'


const height = Dimensions.get('window').height



type ModalProps = {
    title: string
    message: string
    btnLabel: string
    files: FileData[]
    currentFileIndex: number
    setCurrentFileIndex: React.Dispatch<SetStateAction<number | null>>
    control: any
    setFiles: React.Dispatch<SetStateAction<FileData[]>>
    onPressBtn: () => void
    editAmount?: string | null | number
    closeIcon?: boolean
    isEdit?: boolean
    prevReceipts?: any[]
    prevReceiptIndex?: number
    setPrevReceiptIndex?: React.Dispatch<SetStateAction<number | null>>
    setPrevReceipts?: React.Dispatch<SetStateAction<any[]>>
    currencies?: any[]
    selectedCurrency?: string
    empCurrencyCode?: string
    currencyData?: any
    onPressUploadFile: () => void
    uploadingNewFile?: boolean
    hasSubmit?: boolean
    onSubmit?: () => void
    receiptAmount?: string
    currentFileType?: fileTypes | null
    setCurrentFileType?: React.Dispatch<SetStateAction<fileTypes | null>>
} & SwipeableModalProps

export const SWIPEABLE_MODAL_OFFSET_TOP = 110
export const SWIPEABLE_MODAL_HEIGHT = height - SWIPEABLE_MODAL_OFFSET_TOP

const BottomModalFilesExpense = ({
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
    prevReceiptIndex,
    setPrevReceiptIndex,
    currencies,
    selectedCurrency,
    empCurrencyCode,
    currencyData,
    uploadingNewFile,
    setPrevReceipts,
    onPressUploadFile,
    hasSubmit = false,
    receiptAmount,
    onSubmit,
    currentFileType,
    setCurrentFileIndex,
    setCurrentFileType,
    ...rest
}: ModalProps) => {
    const { control, watch, handleSubmit, setValue, setError, clearErrors,
        formState: { errors }
    } = useForm()

    const [showCountryPicker, setShowCountryPicker] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const amount = watch('amount')

    useEffect(() => {
        if (isEmpty(files) && isEmpty(prevReceipts)) {
            setError('files', {
                type: 'manual',
                message: 'Please select a file to upload'
            })
            return
        } else {
            clearErrors('files')
        }

        if (!isEmpty(files) && !isUndefined(files[currentFileIndex]) && !isEmpty(amount)) {

            const updatedFiles = [...files] // Create a copy of the files array
            const file = updatedFiles[currentFileIndex] // Get the specific file object to update

            file.amount = amount // Update the amount property of the file object
            // Update the state array with the updatedFiles
            // Assuming you have a setState function to update the state array, use it as:
            setFiles(updatedFiles)
        }

    }, [amount, files.length])

    useEffect(() => {
        if (editAmount) {
            setValue('amount', editAmount)
        }
    }, [editAmount])

    const handleClose = () => {
        const updatedFiles = [...files] // Create a copy of the files array]
        updatedFiles?.splice(currentFileIndex, 1)
        setFiles(updatedFiles)
        onHide()
    }

    const submitValue = () => {

        const sumFilesAmount = files.reduce((acc, file) => {
            return acc + Number(file.amount)
        }, 0)

        const sumPrevReceiptsAmount = prevReceipts?.reduce((accr, receipt) => {
            return accr + Number(receipt.amount)
        }, 0)

        //sum prevreceipts apart from the current receipt by prevReceiptIndex
        const sumPrevReceiptsAmountWithoutCurrent = prevReceipts?.reduce((accr, receipt, index) => {
            if (index !== prevReceiptIndex) {
                return accr + Number(receipt.amount)
            }
            return accr
        }, 0)


        if (currentFileType === fileTypes.RECEIPT) {
            const updatedReceipts = [...prevReceipts]
            const newReceipts = updatedReceipts?.filter((receipt, index) => index !== prevReceiptIndex)
            setPrevReceipts?.(newReceipts)
        }

        // return
        const totalSum = sumFilesAmount + sumPrevReceiptsAmount

        if ((sumFilesAmount + sumPrevReceiptsAmountWithoutCurrent) > Number(receiptAmount)) {
            setError('amount', {
                type: 'manual',
                message: 'Amount exceeds receipt amount'
            })
            return
        } else {
            clearErrors('amount')
        }

        if (hasSubmit) {

            onSubmit?.()
        }
        onHide()
        setTimeout(() => {
            setValue('amount', '')
            setCurrentFileIndex?.(null)
            setCurrentFileType?.(null)
        }, 2000)
    }

    return (
        <Modal
            statusBarTranslucent
            isVisible={isOpen}
            useNativeDriverForBackdrop
            // coverScreen
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
                        <Text fontFamily={'heading'} color="charcoal" fontSize="20px" justifyContent={'center'}>
                            {title}
                        </Text>
                        {closeIcon ? (
                            <Pressable onPress={onHide} ml={'auto'}>
                                <XIcon color="#061938" width={24} height={24} />
                            </Pressable>
                        ) : null}
                    </HStack>
                    <Box mt="40px" mb={'30px'}>
                        {!isEmpty(files) && !isUndefined(files[currentFileIndex]) ? (
                            <DocumentPlaceHolder
                                name={files[currentFileIndex]?.name}
                                close
                                onClose={handleClose}
                            />
                        ) : <FileUploadButton
                            label={'Choose Receipt Files'}
                            onPress={onPressUploadFile}
                        />
                        }
                        {
                            (isEdit && !isEmpty(prevReceipts) && !uploadingNewFile) ? (
                                <DocumentPlaceHolder
                                    name={getFileNameFromUrl(prevReceipts?.[currentFileIndex]?.attachment) ?? ''}
                                    close
                                    onClose={handleClose}
                                />
                            ) : null
                        }

                        {isEmpty(files) ? <Text fontFamily={'heading'} color="green.70" fontSize="16px" mt={'16px'}>
                            Please Upload a file to proceed
                        </Text>
                            : null
                        }

                    </Box>

                    <CommonInputCurrency
                        name="amount"
                        control={control}
                        rules={{
                            required: { value: true, message: 'Amount is required' },
                        }}
                        label="Claim amount for this receipt"
                        placeholder="Amount"
                        disableCurrency={true}
                        showCountryPicker={showCountryPicker}
                        setShowCountryPicker={setShowCountryPicker}
                        currencyData={currencyData}
                        open={isOpen}
                        setValue={setValue}
                        disabled={true}
                    />


                    <Button onPress={handleSubmit(submitValue)}
                        mb={'32px'}
                        mt={'16px'}
                        disabled={isEmpty(files)}
                        h={'48px'}
                        background={isEmpty(files) ? 'green.30' : 'green.50'}
                        {...rest} isDisabled={loading}>
                        {loading ? (
                            <Spinner color={'white'} />
                        ) : (
                            <Text fontFamily={'heading'} color={'white'} fontSize={'16px'}>
                                Upload
                            </Text>
                        )}
                    </Button>
                    <LoadingModal
                        isVisible={loading}
                        message="Loading Image" />
                </Box>
            </KeyboardAwareScrollView>
        </Modal>
    )
}

export default BottomModalFilesExpense

const styles = StyleSheet.create({
    container: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    topOffset: {
        // marginTop: SWIPEABLE_MODAL_OFFSET_TOP,
    },
})

