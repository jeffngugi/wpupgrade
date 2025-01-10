import React, { useEffect, useState } from 'react'
import { Box, Button, Progress, ScrollView, Text } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import { useForm } from 'react-hook-form'
import { WalletRoutes } from '~types'
import CommonInput from '~components/inputs/CommonInput'
import DropDownPicker, { optionsType } from '~components/DropDownPicker'
import {
  useGetSecurityQuestions,
  useGetWalletUser,
  useSecurityQuestions,
} from '~api/wallet'
import { createSelectOptions } from '~helpers'
import SubmitButton from '~components/buttons/SubmitButton'

const WalletRegistration2 = ({ navigation }) => {
  const { data, isLoading: loadingQuestions } = useGetSecurityQuestions()
  const { data: userData } = useGetWalletUser()
  const [open, setOpen] = useState('')
  const [question1, setQuestion1] = useState('')
  const [question2, setQuestion2] = useState('')
  const [question3, setQuestion3] = useState('')
  const [securityQuestions, setSecurityQuestions] = useState()
  const { control, handleSubmit, setValue } = useForm()

  const questionsSelect = createSelectOptions(data?.data, 'uuid', 'question')

  const question1Options = questionsSelect.filter(
    q => q.value !== question2 && q.value !== question3 && q.value !== '',
  )
  const question2Options = questionsSelect.filter(
    q => q.value !== question1 && q.value !== question3 && q.value !== '',
  )
  const question3Options = questionsSelect.filter(
    q => q.value !== question1 && q.value !== question2 && q.value !== '',
  )

  const { mutate, isLoading } = useSecurityQuestions()
  const onSubmit = data => {
    const { answer1, answer2, answer3, question1, question2, question3 } = data
    const submitData = {
      user_uuid: userData.data.uuid,
      answers: [
        {
          question_uuid: question1,
          answer: answer1,
        },
        {
          question_uuid: question2,
          answer: answer2,
        },
        {
          question_uuid: question3,
          answer: answer3,
        },
      ],
    }

    mutate(submitData, {
      onSuccess: data => {
        console.log('Data for success2323', data)
        navigation.navigate(WalletRoutes.CreatePin)
      },
    })

    // console.log('Submit data', submitData)
    // navigation.navigate(WalletRoutes.CreatePin)
  }
  return (
    <Box flex={1} safeArea backgroundColor="white">
      <Box paddingX="16px" mb="18px">
        <ScreenHeader
          title="Security questions"
          onPress={() => navigation.goBack()}
        />
      </Box>
      <Progress
        value={70}
        _filledTrack={{
          bg: 'green.40',
          height: '8px',
        }}
      />
      <Box paddingX="16px" flex={1}>
        <ScrollView flex={1}>
          <Text fontSize="16px" my="10px" color="charcoal">
            This helps keep your wallet secure.
          </Text>
          <Text color="charcoal" my="10px" fontSize="16px">
            Security Question 1
          </Text>

          <DropDownPicker
            control={control}
            value={question1}
            open={open === 'question1'}
            options={question1Options}
            setOptions={setSecurityQuestions}
            setValue={setQuestion1}
            setOpen={() => {
              open === 'question1' ? setOpen('') : setOpen('question1')
            }}
            rules={{
              required: { value: true, message: 'Question is required' },
            }}
            name="question1"
            zIndex={1002}
          />
          <Box my="px" />
          <CommonInput
            label="Answer"
            name={'answer1'}
            control={control}
            placeholder="Answer"
            rules={{
              required: { value: true, message: 'Answer is required' },
            }}
          />
          <Text color="charcoal" my="10px" mt="30px" fontSize="16px">
            Security Question 2
          </Text>

          <DropDownPicker
            control={control}
            value={question2}
            open={open === 'question2'}
            options={question2Options}
            setOptions={setSecurityQuestions}
            setValue={setQuestion2}
            setOpen={() => {
              open === 'question2' ? setOpen('') : setOpen('question2')
            }}
            rules={{
              required: { value: true, message: 'Question is required' },
            }}
            name="question2"
            zIndex={1001}
          />
          <Box my="4px" />
          <CommonInput
            label="Answer"
            name={'answer2'}
            control={control}
            placeholder="Answer"
            rules={{
              required: { value: true, message: 'Answer is required' },
            }}
          />
          <Text color="charcoal" my="10px" mt="30px" fontSize="16px">
            Security Question 3
          </Text>

          <DropDownPicker
            control={control}
            value={question3}
            open={open === 'question3'}
            options={question3Options}
            setOptions={setSecurityQuestions}
            setValue={setQuestion3}
            setOpen={() => {
              open === 'question3' ? setOpen('') : setOpen('question3')
            }}
            rules={{
              required: { value: true, message: 'Question is required' },
            }}
            name="question3"
            zIndex={1000}
          />
          <Box my="4px" />
          <CommonInput
            label="Answer"
            name={'answer3'}
            control={control}
            placeholder="Answer"
            rules={{
              required: { value: true, message: 'Answer is required' },
            }}
          />
          <Box my="20px" />
        </ScrollView>
        <SubmitButton
          onPress={handleSubmit(onSubmit)}
          title="Next"
          loading={isLoading}
        />
      </Box>
    </Box>
  )
}

export default WalletRegistration2
