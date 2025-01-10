import { useMutation, useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useSelector } from 'react-redux'
import { userQKeys } from '~api/QueryKeys'
import { queryClient } from '~ClientApp'
import { State } from '~declarations'

export type TChangePassword = {
  old_password: string
  new_password: string
  confirm_password: string
}

export type TUpdateEmail = {
  personal_email: string
  employee_id: number | string
}

export type TEditAddress = {
  city: string
  postal_address: string
  road: string
  zip_code: string
  employee_id: number | string
}

export type TEditEducation = {
  date: string
  graduation_date: string
  employee_id: number | string
}

export type TContactPerson = {
  contact: string
  name: string
  relationship: string
  employee_id: number | string
}

const getMyProfile = async (employee_id: string | number) => {
  const { data } = await axios.get('home/myprofile', {
    params: {
      id: employee_id,
    },
  })
  return data
}
export const useMyProfile = () => {
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)
  const data = useQuery(userQKeys.myprofile, () => getMyProfile(employee_id))
  return data
}

export const uploadProfilePic = async (profileData: unknown) => {
  const { data } = await axios.post(
    'home/user/update/profile/photo',
    profileData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    },
  )
  return data
}

export const useUploadProfilePic = () => {
  return useMutation((payload: unknown) => uploadProfilePic(payload))
}

const emergencyContact = async (employee_id: string | number) => {
  const { data } = await axios.get('home/employee-emergency-contacts', {
    params: { employee_id },
  })
  return data
}

export const useEmergencyContact = () => {
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)
  const data = useQuery(userQKeys.emergency, () =>
    emergencyContact(employee_id),
  )
  return data
}

const nextOfKin = async (employee_id: string | number) => {
  const { data } = await axios.get('home/employee-next-of-kins', {
    params: { employee_id },
  })
  return data
}

export const useNextOfKin = () => {
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)
  const data = useQuery(userQKeys.nextOfKin, () => nextOfKin(employee_id))
  return data
}

const changePassword = async (passwordData: TChangePassword) => {
  const { data } = await axios.post('home/user/change/password', passwordData)
  return data
}

export const useChangePassword = () => {
  return useMutation<
    unknown,
    AxiosError<{ errors: string[] }>,
    TChangePassword
  >(changePassword)
}

const updateEmail = async (emailData: TUpdateEmail) => {
  const { data } = await axios.post('home/employee-profile-update', emailData)
  return data
}

export const useUpdateEmail = () => {
  return useMutation<unknown, AxiosError<{ errors: string[] }>, TUpdateEmail>(
    updateEmail,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(userQKeys.myprofile)
      },
    },
  )
}

const editAddress = async (address: TEditAddress) => {
  const { data } = await axios.post('home/employee-profile-update', address)
  return data
}

export const useEditAddress = () => {
  return useMutation<unknown, AxiosError<{ errors: string[] }>, TEditAddress>(
    editAddress,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(userQKeys.myprofile)
      },
    },
  )
}

const education = async (educationData: TEditEducation) => {
  const { data } = await axios.post(
    'hrm/employee/update/profile',
    educationData,
  )
  return data
}

export const useEditEducation = () => {
  return useMutation<unknown, AxiosError<{ errors: string[] }>, TEditEducation>(
    education,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(userQKeys.myprofile)
      },
    },
  )
}

const deleteNextOfKin = async (id: string): Promise<unknown> => {
  const { data } = await axios.delete(`home/employee-next-of-kins/${id}`)
  return data
}

export const useDeleteNextOfKin = () => {
  return useMutation<unknown, AxiosError<{ errors: string[] }>, string>(
    deleteNextOfKin,
    {
      onSuccess: () => queryClient.invalidateQueries(userQKeys.nextOfKin),
    },
  )
}

const deleteEmergency = async (id: string): Promise<unknown> => {
  const { data } = await axios.delete(`home/employee-emergency-contacts/${id}`)
  return data
}

export const useDeleteEmergency = () => {
  return useMutation<unknown, AxiosError<{ errors: string[] }>, string>(
    deleteEmergency,
    {
      onSuccess: () => queryClient.invalidateQueries(userQKeys.emergency),
    },
  )
}

const addNextOfKin = async (nextOfKinData: unknown) => {
  const { data } = await axios.post('home/employee-next-of-kins', nextOfKinData)
  return data
}

export const useAddNextOfKin = () => {
  return useMutation<unknown, AxiosError<{ errors: string[] }>, TContactPerson>(
    addNextOfKin,
    {
      onSuccess: () => queryClient.invalidateQueries(userQKeys.nextOfKin),
    },
  )
}

const addEmergencyContact = async (
  emergencyData: Omit<TContactPerson, 'relationship'>,
) => {
  const { data } = await axios.post(
    'home/employee-emergency-contacts',
    emergencyData,
  )
  return data
}

export const useAddEmergencyContact = () => {
  return useMutation<
    unknown,
    AxiosError<{ errors: string[] }>,
    Omit<TContactPerson, 'relationship'>
  >(addEmergencyContact, {
    onSuccess: () => queryClient.invalidateQueries(userQKeys.emergency),
  })
}

const editNextOfKin = async (payload: any) => {
  const { id, formData } = payload
  const { data } = await axios.put(`home/employee-next-of-kins/${id}`, formData)
  return data
}

export const useEditNextOfKin = () => {
  return useMutation<
    unknown,
    AxiosError<{ errors: string[] }>,
    { formData: TContactPerson; id: string }
  >(editNextOfKin, {
    onSuccess: () => queryClient.invalidateQueries(userQKeys.nextOfKin),
  })
}

const editEmergencyContact = async (emergencyData: {
  formData: Omit<TContactPerson, 'relationship'>
  id: string
}) => {
  const { id, formData } = emergencyData
  const { data } = await axios.put(
    `home/employee-emergency-contacts/${id}`,
    formData,
  )
  return data
}

export const useEditEmergencyContact = () => {
  return useMutation<
    unknown,
    AxiosError<{ errors: string[] }>,
    { formData: Omit<TContactPerson, 'relationship'>; id: string }
  >(editEmergencyContact, {
    onSuccess: () => queryClient.invalidateQueries(userQKeys.emergency),
  })
}
