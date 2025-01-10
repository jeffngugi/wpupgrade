import React from 'react'
import { Box, HStack, Menu, Pressable, Text } from 'native-base'
import DocumentPlaceHolderList from '~screens/document/components/DocumentPlaceHolderList'

type ImagesGridViewProps = {
  files: []
  receipts: []
  setPrevReceipts: (newFiles: []) => void
  setFiles: (newFiles: []) => void
}

enum fileTypes {
  ATTACHMENT,
  RECEIPT,
}

function getFileNameFromUrl(url: string) {
  const fileName = url?.match(/[^/]*$/)?.[0] ?? null
  return fileName
}
export const ImagesGridView = ({
  files,
  receipts,
  setPrevReceipts,
  setFiles,
}: ImagesGridViewProps) => {
  const gridArray: any = [[]]
  const menuItemsToGridArray = (totalColumns: number) => {
    let countColumns = 1
    for (let i = 0; i < files.length; i++) {
      const newFile: object = { file: files[i], type: fileTypes.ATTACHMENT }
      gridArray[gridArray.length - 1].push(newFile)
      if (countColumns <= totalColumns) {
        countColumns++
      }
      if (countColumns > totalColumns && i !== files.length - 1) {
        countColumns = 1
        gridArray.push([])
      }
    }
    for (let i = 0; i < receipts.length; i++) {
      const receipt: object = receipts[i]
      const newFile = {
        file: {
          name: getFileNameFromUrl(receipts[i]?.attachment),
          ...receipt,
        },
        type: fileTypes.RECEIPT,
      }
      gridArray[gridArray.length - 1].push(newFile)
      if (countColumns <= totalColumns) {
        countColumns++
      }
      if (countColumns > totalColumns && i !== files.length - 1) {
        countColumns = 1
        gridArray.push([])
      }
    }

    return gridArray
  }

  const handleRemove = (file, type, indexToRemove) => {
    if (type == fileTypes.ATTACHMENT) {
      const newFiles: [] = files
        .slice(0, indexToRemove)
        .concat(files.slice(indexToRemove + 1))
      setFiles(newFiles)
    } else if (type == fileTypes.RECEIPT) {
      const newFiles: [] = receipts
        .slice(0, indexToRemove)
        .concat(receipts.slice(indexToRemove + 1))
      setPrevReceipts(newFiles)
    }
  }

  const gridArdray = menuItemsToGridArray(2)
  const renderGrid = (gridArray: any[]) => {
    return gridArray.map((row, index) => (
      <HStack justifyContent="space-between" key={index.toString()}>
        {row.map(({ file, type }: any, index: number) => {
          return (
            <Box my="5px" key={file.name} w="48%" background={'amber.400'}>
              <Menu
                w="190"
                trigger={triggerProps => {
                  return (
                    <Pressable
                      accessibilityLabel="More options menu"
                      {...triggerProps}>
                      <DocumentPlaceHolderList
                        key={file.name}
                        name={file.name}
                        amount={file.amount}
                      />
                    </Pressable>
                  )
                }}>
                <Menu.Item>
                  <Text fontFamily={'body'} fontSize={'16px'}>
                    View
                  </Text>
                </Menu.Item>
                <Menu.Item onPress={() => handleRemove(file, type, index)}>
                  <Text fontFamily={'body'} fontSize={'16px'}>
                    Delete
                  </Text>
                </Menu.Item>
              </Menu>
            </Box>
          )
        })}
      </HStack>
    ))
  }

  return <>{renderGrid(gridArdray)}</>
}
