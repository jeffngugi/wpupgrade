import { Dimensions, Pressable, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Modal from 'react-native-modal';
import { Box, HStack, Text, VStack } from 'native-base';
import { SwipeableModalProps } from './types';
import CommonInputSubmit from '~components/inputs/CommonInputSubmit';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import XIcon from '~assets/svg/x.svg';
import TextAreaInput from '~components/inputs/TextAreaInput';
import SubmitButton from '~components/buttons/SubmitButton';
import DetailItem from '~components/DetailItem';

const height = Dimensions.get('window').height;

type ModalProps = {
  title: string;
  message: string;
  btnLabel: string;
  control: any;
  expenseDetail: any;
  onPressBtn: () => void;
  editReason?: string | null;
  closeIcon?: boolean;
  onSubmit?: () => void;
  loading?: boolean;
} & SwipeableModalProps;

export const SWIPEABLE_MODAL_OFFSET_TOP = 110;
export const SWIPEABLE_MODAL_HEIGHT = height - SWIPEABLE_MODAL_OFFSET_TOP;

const BottomModalFilesImprestVerification = ({
  isOpen,
  onHide,
  onSwipeComplete,
  onBackdropPress,
  title,
  editReason,
  expenseDetail,
  onSubmit,
  closeIcon,
  loading,
  ...rest
}: ModalProps) => {
  const { control, watch, handleSubmit, setValue } = useForm();
  const reason = watch('reason');

  useEffect(() => {
    if (editReason) {
      setValue('reason', editReason);
    } else {
      setValue('reason', '');
    }
  }, [editReason]);

  const submitValue = (formData) => {
    onSubmit?.(formData);
  };

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
      onModalHide={onHide}
      onSwipeComplete={onSwipeComplete}
      onBackdropPress={onBackdropPress}
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
          <HStack justifyContent={'space-between'} alignItems={'center'} mb={'30px'}>
            <Text fontFamily={'heading'} color="charcoal" fontSize="20px">
              {title}
            </Text>
            {closeIcon ? (
              <Pressable onPress={onHide} ml={'auto'}>
                <XIcon color="#061938" width={24} height={24} />
              </Pressable>
            ) : null}
          </HStack>
          <DetailItem
            label="Title"
            value={expenseDetail?.title}
          />
          <DetailItem
            label="Applied Amount"
            value={expenseDetail?.amount}
          />
          <DetailItem
            label="Spent Amount"
            value={`${expenseDetail?.currency_code} ${expenseDetail?.spent_amount}`}
          />
          <DetailItem
            label="Available Amount"
            value={`${expenseDetail?.currency_code} ${expenseDetail?.available_amount}`}
          />
          <Box mt={'20px'} />
          {expenseDetail?.utility_status === 'Open' ? <TextAreaInput
            name="reason"
            control={control}
            placeholder="Enter verification reason"
            label="Reason"
            rules={{
              required: { value: true, message: 'Reason is required' },
            }}

            mb={'20px'}
          /> : null}
          <SubmitButton
            title="Submit"
            onPress={handleSubmit(submitValue)}
            loading={loading}
            disabled={false}
          />
        </Box>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default BottomModalFilesImprestVerification;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'flex-end',
  },
});
