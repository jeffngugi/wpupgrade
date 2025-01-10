import React, { useState } from 'react'
import SwipableModal from '~components/modals/SwipableModal'
import { Box, Button, HStack, Pressable, Text, useToast } from 'native-base'
import XIcon from '~assets/svg/wallet-x.svg'
import { useForm } from 'react-hook-form'
import DropdownInputV2 from '~components/dropdown/DropDownV2'

import {
  useDisable2FASecurity,
  useGetSecurityQuestions,
  useGetWalletUser,
  useUpdate2FASecurityQuestion,
} from '~api/wallet'
import CommonInput from '~components/inputs/CommonInput'
import { createSelectOptions } from '~helpers'
import { queryClient } from '~ClientApp'
import { walletQKeys } from '~api/QueryKeys'

type Props = {
  isOpen: boolean
  hideModal: () => void
  isSecurityQuestionsEnabled?: boolean
}

const SecurityQuestionsModal = (p: Props) => {
  const { control, handleSubmit, setValue, reset } = useForm()

  const { data: walletUser } = useGetWalletUser()
  const user_uuid = walletUser?.data?.uuid
  const { mutate: mutate2FA, isLoading } = useUpdate2FASecurityQuestion()
  const { mutate: mutateDisable2FA, isLoading: loadingDisable2FA } =
    useDisable2FASecurity()
  const { data } = useGetSecurityQuestions()
  const securityQuestions = createSelectOptions(data?.data, 'uuid', 'question')

  const mutateFn = p.isSecurityQuestionsEnabled ? mutateDisable2FA : mutate2FA

  const onSubmit = payload => {
    const submitPayload = {
      user_uuid,

      ...(!p.isSecurityQuestionsEnabled
        ? {
            answers: [
              {
                answer: payload.answer,
                question_uuid: payload.security_question,
              },
            ],
          }
        : {}),
      password: payload.pin,
      action: p.isSecurityQuestionsEnabled
        ? 'SECURITY_QUESTIONS'
        : 'ENABLE_2FA',
    }

    mutateFn(submitPayload, {
      onSuccess: response => {
        p.hideModal()
        reset()
        setTimeout(() => {
          queryClient.invalidateQueries(walletQKeys.notificationSettings)
        }, 1000)
      },
    })
  }
  return (
    <SwipableModal
      isOpen={p.isOpen}
      onHide={p.hideModal}
      onBackdropPress={p.hideModal}>
      <Box px="16px" flex={1} top="-20">
        <HStack alignItems="center" mb="1px">
          <Text
            color="#253545"
            fontSize="20px"
            lineHeight="30px"
            mr="auto"
            fontFamily="heading">
            Security Questions
          </Text>
          <Pressable onPress={p.hideModal}>
            <XIcon color="#253545" />
          </Pressable>
        </HStack>
        <Box mb="12px">
          <Text
            color="#253545"
            fontSize="16px"
            lineHeight="30px"
            fontFamily="body">
            Set a new security question to secure your account
          </Text>
        </Box>
        {!p.isSecurityQuestionsEnabled ? (
          <>
            <DropdownInputV2
              items={securityQuestions}
              control={control}
              setValue={value => setValue('security_question', value)}
              name="security_question"
              label="Security Question"
            />

            <CommonInput
              control={control}
              label="Answer"
              name="answer"
              placeholder="Answer"
              rules={{
                required: { value: true, message: 'Answer is required' },
              }}
              my="14px"
            />
          </>
        ) : null}

        {/* <Box my="8px" /> */}
        <CommonInput
          control={control}
          label="pin*"
          name="pin"
          placeholder="Enter Pin"
          password={true}
          rules={{
            required: { value: true, message: 'Pin is required' },
          }}
          my="14px"
        />

        <Button
          isLoading={isLoading || loadingDisable2FA}
          mt="50px"
          mb="20px"
          _text={{
            color: 'white',
            fontSize: '16px',
          }}
          onPress={handleSubmit(onSubmit)}>
          Submit
        </Button>
      </Box>
    </SwipableModal>
  )
}

export default SecurityQuestionsModal
