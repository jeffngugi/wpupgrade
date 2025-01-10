import React from 'react'
import { Menu, Pressable, Text } from 'native-base'
import DocumentPlaceHolderList from '~screens/document/components/DocumentPlaceHolderList'
import { ScrollView } from 'react-native'
import FileViewer from 'react-native-file-viewer'
import RNFS from 'react-native-fs'
import LoadingModal from '~components/modals/LoadingModal'
import { FileData } from '~types'
import DocumentPlaceHolder from '~screens/expenses-redesign/components/DocumentPlaceHolder'

type FileScrollViewProps = {
    files: FileData[]
    receipts?: any[]
    setPrevReceipts?: (newFiles: []) => void
    setFiles: (newFiles: []) => void
    handleEditClaimAmount?: (index: number) => void
    hasDelete?: boolean
    hasEdit?: boolean
}

enum fileTypes {
    ATTACHMENT,
    RECEIPT,
}

export function getFileNameFromUrl(url: string) {
    const fileName = url?.match(/[^/]*$/)?.[0] ?? null
    return fileName
}
export const FileScrollViewList = ({
    files,
    receipts,
    setPrevReceipts,
    setFiles,
    hasEdit,
    handleEditClaimAmount,
    hasDelete = true,
}: FileScrollViewProps) => {
    const allFiles: any = []
    const [loading, setLoading] = React.useState(false)

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
                <ScrollView >
                    {/* <Box my="5px" background={'amber.400'}> */}
                    {allFiles.map(({ file, type, fileIdx }: any, index: number) => {
                        return (
                            <Menu
                                key={file.name}
                                defaultIsOpen={false}
                                trigger={triggerProps => {
                                    return (
                                        <Pressable
                                            accessibilityLabel="More options menu"
                                            maxWidth={'60%'}
                                            marginRight={2}
                                            {...triggerProps}>
                                            <DocumentPlaceHolder
                                                key={file.name}
                                                name={file.name}
                                                amount={file.amount}
                                            />
                                        </Pressable>
                                    )
                                }}>
                                <Menu.Item onPress={() => handleView(file, type)}>
                                    <Text fontFamily={'body'} fontSize={'16px'}>
                                        View
                                    </Text>
                                </Menu.Item>
                                {hasEdit && (
                                    <Menu.Item onPress={() => handleEditClaimAmount?.(index)}>
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
                        )
                    })}
                    {/* </Box> */}
                </ScrollView>
            </React.Fragment>
        )
    }

    return <>{renderFiles(allFiles)}</>
}
