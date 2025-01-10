import React from 'react';
import { Box, HStack, VStack, Text, Icon, ScrollView, Pressable, Menu } from 'native-base';
import DocumentsGreenIcon from '~assets/svg/documents-green.svg';
import { dateFormatter } from '~utils/date';
import { getFileNameFromUrl } from '~components/FilesScrollView';
import MoreICon from '~assets/svg/more-vertical.svg'
import { fileTypes } from './FileScrollViewList';
import { currencyDisplayFormatter } from '~utils/appUtils';

type ReceiptItemProps = {
    title: string;
    description?: string;
    date: string;
    amount: string;
    attachment?: string;
    handleRemoveReceipt: (id: number) => void;
    handleEditReceipt: (id: number) => void;
    handleViewReceipt: (id: number, type: keyof fileTypes) => void;
    id: number;
    currencyCode?: string;
};

const RightItem = (
    { handlePress }:
        { handlePress: (type: string) => void }
) => (
    <Menu
        w="190"
        shouldOverlapWithTrigger // Ensures the menu can overlap if inside a modal
        zIndex={3000}
        defaultIsOpen={false}
        trigger={triggerProps => {
            return (
                <Pressable accessibilityLabel="More options menu" {...triggerProps} >
                    <MoreICon color="#253545" />
                </Pressable >
            )
        }}>
        <Menu.Item onPress={() => handlePress('view')}>
            <Text fontFamily={'body'} fontSize={'16px'}>
                View
            </Text>
        </Menu.Item>
        <Menu.Item onPress={() => {
            handlePress('edit')
        }}>
            <Text fontFamily={'body'} fontSize={'16px'}>
                Edit
            </Text>
        </Menu.Item>

        <Menu.Item onPress={() => {
            handlePress('delete')
        }}>
            <Text fontFamily={'body'} fontSize={'16px'}>
                Delete
            </Text>
        </Menu.Item>
    </Menu >
)

export const ReceiptItem = ({ title, date, amount, handleRemoveReceipt, handleEditReceipt, handleViewReceipt, id, currencyCode }: ReceiptItemProps) => {
    const handlePress = (type: string) => {
        if (type === 'delete') {
            handleRemoveReceipt(id)
        }
        else if (type === 'edit') {
            handleEditReceipt(id)
        }
        else if (type === 'view') {
            handleViewReceipt(id, fileTypes.RECEIPT)
        }
    }

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
                        {title}
                    </Text>
                    <Text fontSize="12px" color="grey" ml={'8px'}>
                        {date}
                    </Text>
                </HStack>
                <Text fontWeight="bold" color="charcoal" fontSize="16px">
                    {currencyCode} {currencyDisplayFormatter(amount)}
                </Text>

                {/* <Text fontSize="14px" color="grey">
                {description}
            </Text> */}
            </VStack>

            <RightItem handlePress={handlePress} />

        </HStack >
    )
};

type ExpenseReceiptListProps = {
    receipts: ReceiptItemProps[];
    files?: any;
    handleRemoveReceipt: (id: number) => void;
    handleEditReceipt: (id: number) => void;
    handleViewReceipt: (file: any, type: keyof fileTypes) => void;
    currencyCode?: string;
};

const ExpenseReceiptList = ({ receipts, files, handleRemoveReceipt, handleEditReceipt, handleViewReceipt, currencyCode }: ExpenseReceiptListProps) => {
    // Example receipt data

    return (
        <Box flex={1}
            zIndex={1000}
        >
            {/* Header */}


            {/* Receipts List */}
            <ScrollView >
                {files && files.map((file, index) => (
                    <ReceiptItem
                        key={index}
                        title={file.name}
                        date={dateFormatter(file.date, 'MMM do, yyyy')}
                        amount={file.amount}
                        id={file.id}
                        handleRemoveReceipt={handleRemoveReceipt}
                        handleEditReceipt={handleEditReceipt}
                        handleViewReceipt={() => handleViewReceipt(file, fileTypes.ATTACHMENT)}
                        currencyCode={currencyCode}
                    />
                ))}

                {receipts && receipts.map((receipt, index) => (
                    <ReceiptItem
                        key={index}
                        title={getFileNameFromUrl(receipt.attachment)}
                        description={receipt.description}
                        date={dateFormatter(receipt.date, 'MMM do, yyyy')}
                        amount={receipt.amount}
                        id={receipt.id}
                        handleRemoveReceipt={handleRemoveReceipt}
                        handleEditReceipt={handleEditReceipt}
                        handleViewReceipt={() => handleViewReceipt(receipt, fileTypes.RECEIPT)}
                        currencyCode={currencyCode}
                    />
                ))}
            </ScrollView>
        </Box >
    );
};

export default ExpenseReceiptList;
