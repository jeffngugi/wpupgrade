import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { userQKeys } from '~api/QueryKeys'

const getActiveLeaves = async () => {
  const { data } = await axios.get('hrm/active-leaves-calendar')
  return data
}

const getTasks = async () => {
  const { data } = await axios.get('dashboard/tasks')
  return data
}

const getEvents = async () => {
  const { data } = await axios.get('dashboard/events')
  return data
}

const getProfile = async () => {
  const { data } = await axios.get('home/user/profile')
  return data
}

export const testMeta = async () => {
  const { data } = await axios.get('home/user/profe')
  return data
}

export const useFetchProfile = () => {
  const data = useQuery(userQKeys.profile, getProfile)

  return data
}

export const useTestMeta = () => {
  return useQuery(['TestingKey'], testMeta, {
    onSuccess: () => {
      console.log('Data from success meta test')
    },
    onError: error => {
      console.log('MEta testing if data is there', error)
    },
  })
}

export const useTasks = () => {
  const data = useQuery(userQKeys.tasks, getTasks)

  return data
}

export const useEvents = () => {
  const data = useQuery(userQKeys.events, getEvents)

  return data
}

export const useActiveLeaves = () => {
  const data = useQuery(userQKeys.activeLeaves, getActiveLeaves)
  return data
}
