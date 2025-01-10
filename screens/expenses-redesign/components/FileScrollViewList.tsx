import React, { useEffect } from 'react'
import { Box, FlatList, HStack, List, Menu, Pressable, Text, VStack } from 'native-base'
import DocumentsGreenIcon from '~assets/svg/documents-green.svg';
import { Dimensions, Platform, ScrollView } from 'react-native'
import FileViewer from 'react-native-file-viewer'
import RNFS from 'react-native-fs'
import LoadingModal from '~components/modals/LoadingModal'
import { FileData } from '~types'
import MoreICon from '~assets/svg/more-vertical.svg'
import { dateFormatter } from '~utils/date'
import { currencyDisplayFormatter } from '~utils/appUtils';
import ActionSheetModal from '~components/modals/ActionSheetModal';
import XIcon from '~assets/svg/wallet-x.svg'
import { getFileNameFromUrl } from '~helpers';

const windowHeight = Dimensions.get('window').height

const editDeleteViewOptioTypes = [
  { label: 'Edit', value: 'edit' },
  { label: 'Delete', value: 'delete' },
  { label: 'View', value: 'view' }
]

type FileScrollViewProps = {
  files: FileData[]
  receipts: any[]
  setPrevReceipts: (newFiles: []) => void
  setFiles: (newFiles: []) => void
  handleEditClaimAmount?: (index: number, type: fileTypes) => void
  hasDelete: boolean
  hasEdit: boolean
  currencyCode?: string
  onHide?: () => void
}

export enum fileTypes {
  ATTACHMENT,
  RECEIPT,
}


export const FileScrollViewList = ({
  files,
  receipts,
  setPrevReceipts,
  setFiles,
  hasEdit,
  handleEditClaimAmount,
  hasDelete = true,
  currencyCode,
  onHide
}: FileScrollViewProps) => {

  const [loading, setLoading] = React.useState(false)
  const [openActionSheet, setOpenActionSheet] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState({ file: {}, type: null, fileIdx: 0, index: 0 })
  const [allFiles, setAllFiles] = React.useState([])

  const getAllFiles = () => {
    const allFiles = []
    for (let i = 0; i < files.length; i++) {
      const newFile: object = {
        file: files[i],
        type: fileTypes.ATTACHMENT,
        fileIdx: i,
      }
      allFiles.push(newFile)
    }
    for (let i = 0; i < (receipts?.length || 0); i++) {
      const receipt: object = receipts?.[i] ?? {}

      const newFile = {
        file: {
          name: getFileNameFromUrl(receipts?.[i]?.attachment),
          ...receipt,
        },
        type: fileTypes.RECEIPT,
        fileIdx: i,
      }
      allFiles.push(newFile)
    }
    return allFiles
  }

  useEffect(() => {
    setAllFiles(getAllFiles())
  }, [files, receipts])

  const handleRemove = (file, type, indexToRemove) => {
    if (type == fileTypes.ATTACHMENT) {
      const newFiles: [] =
        files.slice(0, indexToRemove).concat(files.slice(indexToRemove + 1)) ||
        []
      setFiles(newFiles)
    } else if (type == fileTypes.RECEIPT) {
      if (!setPrevReceipts || !receipts) {
        return
      }

      const newFiles: [] =
        receipts
          .slice(0, indexToRemove)
          .concat(receipts?.slice(indexToRemove + 1)) || []

      setPrevReceipts(newFiles)
    }
  }

  const handleView = async (file, type) => {
    try {
      if (type == fileTypes.ATTACHMENT) {
        await FileViewer.open(file.uri)
      } else if (type == fileTypes.RECEIPT) {
        handleDowload(file)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDowload = async file => {
    setLoading(true)
    try {
      const url = file.attachment
      const fileName = file.name
      const urlEncoded = encodeURI(url)

      const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`
      const options = {
        fromUrl: urlEncoded,
        toFile: localFile,
      }
      await RNFS.downloadFile(options).promise
      setLoading(false)
      await FileViewer.open(localFile)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const renderFiles = (allFiles: any[]) => {
    return (
      <React.Fragment>
        <LoadingModal isVisible={loading} message="Loading Image" />
        <ScrollView>
          {/* <Box my="5px" background={'amber.400'}> */}
          {allFiles.map(({ file, type, fileIdx }: any, index: number) => {
            return (
              <HStack alignItems="center" justifyContent="space-between" my="12px" bg={'transparent'}
                zIndex={1001}
              >

                {/* Icon */}
                <Box bg="green.30" borderRadius="20px" w={'40px'} h={'40px'} >
                  <DocumentsGreenIcon style={{

                    marginTop: 8,
                    marginLeft: 8,
                  }} />
                </Box>
                {/* Details */}
                <VStack ml={'8px'} w={'68%'} >
                  <HStack alignItems="center">
                    <Text color="green.50" fontSize="14px" fontWeight="bold">
                      {file.name}
                    </Text>
                    <Text fontSize="12px" color="grey" ml={'8px'}>
                      {dateFormatter(file.date, 'MMM do, yyyy')}
                    </Text>
                  </HStack>
                  <Text fontWeight="bold" color="charcoal" fontSize="16px">
                    {currencyCode} {currencyDisplayFormatter(file.amount)}
                  </Text>

                  {/* <Text fontSize="14px" color="grey">
                {description}
            </Text> */}
                </VStack>
                <Menu
                  w="190"
                  shouldOverlapWithTrigger // Ensures the menu can overlap if inside a modal
                  zIndex={3000}
                  defaultIsOpen={false}
                  trigger={triggerProps => {
                    return (
                      <Pressable accessibilityLabel="More options menu"
                        onPress={() => {
                          if (Platform.OS === 'ios') {
                            setOpenActionSheet(true)
                            setSelectedFile({ file, type, fileIdx, index })
                          }

                        }}
                        {...Platform.OS === 'android' ? triggerProps : {}}
                      >
                        <MoreICon color="#253545" />
                      </Pressable >
                    )
                  }}>
                  <Menu.Item onPress={() => handleView(file, type)}>
                    <Text fontFamily={'body'} fontSize={'16px'}>
                      View
                    </Text>
                  </Menu.Item>
                  {hasEdit && (
                    <Menu.Item onPress={() => handleEditClaimAmount?.(fileIdx, type)}>
                      <Text fontFamily={'body'} fontSize={'16px'}>
                        Edit
                      </Text>
                    </Menu.Item>
                  )}
                  {hasDelete && (
                    <Menu.Item onPress={() => handleRemove(file, type, fileIdx)}>
                      <Text fontFamily={'body'} fontSize={'16px'}>
                        Delete
                      </Text>
                    </Menu.Item>
                  )}
                </Menu>
              </HStack>
            )
          })}
          {/* </Box> */}
        </ScrollView>
        <ActionSheetModal
          isOpen={openActionSheet}
          onHide={() => setOpenActionSheet(false)}
          onBackdropPress={() => setOpenActionSheet(false)}
        >
          <Box px="16px" flex={1} top="-20" pb="30px" >
            <HStack mb="20px" alignItems="center" justifyContent="space-between">
              <Text color="charcoal" fontSize="20px" lineHeight="30px">
                View / {hasEdit ? 'Edit' : ''} / {hasDelete ? 'Delete' : ''}
              </Text>
              <Pressable onPress={() => setOpenActionSheet(false)} ml="auto">
                <XIcon color="#253545" />
              </Pressable>
            </HStack>

            {/* edit delete options */}
            <FlatList
              data={editDeleteViewOptioTypes}
              renderItem={({ item, index }) => (
                <Pressable
                  key={item.value}
                  py="12px"
                  borderBottomWidth={1}
                  borderBottomColor="green.50"
                  onPress={() => {
                    if (item.value === 'edit') {
                      handleEditClaimAmount?.(selectedFile.fileIdx, selectedFile.type)
                    } else if (item.value === 'delete') {
                      handleRemove(selectedFile.file, selectedFile.type, selectedFile.fileIdx)
                    } else if (item.value === 'view') {
                      handleView(selectedFile.file, selectedFile.type)
                    }
                    setOpenActionSheet(false)
                    onHide?.()

                  }}>
                  <Text fontFamily="body" fontSize="16px" textAlign="center">
                    {item.label}
                  </Text>
                </Pressable>
              )}
              keyExtractor={item => item.value}
            />

          </Box>
        </ActionSheetModal>
      </React.Fragment>
    )
  }

  return <>{renderFiles(allFiles)}</>
}
