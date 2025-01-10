import React from 'react';
import { Box, HStack, VStack, Text, Icon, ScrollView, Pressable, Menu } from 'native-base';
import DocumentsGreenIcon from '~assets/svg/documents-green.svg';
import { dateFormatter } from '~utils/date';
import { getFileNameFromUrl } from '~components/FilesScrollView';
import MoreICon from '~assets/svg/more-vertical.svg'

type ReceiptItemProps = {
    title: string;
    description?: string;
    date: string;
    amount: string;
    attachment?: string;
    handleRemoveReceipt: (id: number) => void;
    handleEditReceipt: (id: number) => void;
    id: number;
};

const RightItem = (
    { handlePress }:
        { handlePress: (type: string) => void }
) => (
    <Menu
        w="190"
        defaultIsOpen={false}
        trigger={triggerProps => {
            return (
                <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                    <MoreICon color="#253545" />
                </Pressable>
            )
        }}>
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

const ReceiptItem = ({ title, date, amount, handleRemoveReceipt, handleEditReceipt, id }: ReceiptItemProps) => {
    const handlePress = (type: string) => {
        if (type === 'delete') {
            handleRemoveReceipt(id)
        }
        else if (type === 'edit') {
            handleEditReceipt(id)
        }
    }

    return (
        <HStack alignItems="center" justifyContent="space-between" my="12px">

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

                {/* <Text fontSize="14px" color="grey">
                {description}
            </Text> */}
            </VStack>
            <Text fontWeight="bold" color="charcoal">
                {amount}
            </Text>
            <Box justifyContent={'flex-end'} w={'12px'}>
                <RightItem handlePress={handlePress} />
            </Box>

        </HStack >
    )
};

type ExpenseReceiptListProps = {
    receipts: ReceiptItemProps[];
    handleRemoveReceipt: (id: number) => void;
    handleEditReceipt: (id: number) => void;
};

const ExpenseReceiptList = ({ receipts, handleRemoveReceipt, handleEditReceipt }: ExpenseReceiptListProps) => {
    // Example receipt data

    return (
        <Box flex={1} bg="white" >
            {/* Header */}


            {/* Receipts List */}
            <ScrollView>
                {receipts.map((receipt, index) => (
                    <ReceiptItem
                        key={index}
                        title={getFileNameFromUrl(receipt.attachment)}
                        description={receipt.description}
                        date={dateFormatter(receipt.date, 'MMM do, yyyy')}
                        amount={receipt.amount}
                        id={receipt.id}
                        handleRemoveReceipt={handleRemoveReceipt}
                        handleEditReceipt={handleEditReceipt}
                    />
                ))}
            </ScrollView>
        </Box>
    );
};

export default ExpenseReceiptList;
