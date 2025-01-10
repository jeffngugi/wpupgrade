import React from 'react';
import { Box, Text, VStack, HStack, Icon, Pressable } from 'native-base';
import ChevronRightIcon from '~assets/svg/chevron-right-grey.svg';
import ExpenseFileIcon from '~assets/svg/expense-file.svg';
import UsersMultipleIcon from '~assets/svg/users-multiple.svg';
import ScreenHeader from '~components/ScreenHeader';
import { ExpenseRoutesRedesign } from '~types';

const ExpenseOptions = ({ navigation }) => {
  const options = [
    {
      title: "Employee Expense",
      description: "Costs incurred by an employee on behalf of the company (e.g., travel, meals, client).",
      icon: <UsersMultipleIcon />,
      onPress: () => navigation.navigate(ExpenseRoutesRedesign.Record, { isImprest: false })
    },
    {
      title: "Imprest Expense",
      description: "Funds advanced to an employee for immediate expenses, with subsequent reimbursement.",
      icon: <ExpenseFileIcon />,
      onPress: () => navigation.navigate(ExpenseRoutesRedesign.Record, { isImprest: true })
    },
  ];

  return (
    <Box safeArea flex={1} paddingX="16px" backgroundColor="white">
      <ScreenHeader
        title={'Add Expense'}
        onPress={() => navigation.goBack()}

      />
      <Text fontSize="16px" mb="4" textAlign="center" my={'16px'}>
        Select the Expense you want to add
      </Text>
      <VStack space="4" mt="16px">
        {options.map((option, index) => (
          <Pressable
            key={index}
            onPress={option.onPress}
            _pressed={{ backgroundColor: "#F9FAFA" }}

          >
            <HStack
              alignItems="center"
              p="4"
              borderRadius="8"
              background={'#F9FAFA'}
              borderWidth="1"
              borderColor="#e0e0e0"

            >
              {/* <Icon
                as={Ionicons}
                name={option.icon}
                color="#62A446"
                size="6"
                mr="4"
              /> */}
              {option.icon}
              <VStack flex="1" px={'8px'}>
                <Text fontSize="md" fontWeight="bold" color="#253545">
                  {option.title}
                </Text>
                <Text fontSize="sm" color="#6e6e6e">
                  {option.description}
                </Text>
              </VStack>
              <Box justifyContent={"center"} alignItems={"center"}>
                <ChevronRightIcon />
              </Box>
            </HStack>
          </Pressable>
        ))}
      </VStack>
    </Box>
  );
};

export default ExpenseOptions;
