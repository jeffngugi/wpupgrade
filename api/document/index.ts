import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { docQKeys } from '~api/QueryKeys'
import { queryClient } from '~ClientApp'

const getDocuments = async () => {
  const { data } = await axios.get('home/documents')
  return data
}

export const useGetDocuments = () => {
  const data = useQuery(docQKeys.documents, getDocuments)
  return data
}

const documentCategories = async () => {
  const { data } = await axios.get('home/document-categories')
  return data
}

export const useDocumentCategories = () => {
  const data = useQuery(docQKeys.category, documentCategories)
  return data
}

export const addDocuments = async (docData: unknown) => {
  const { data } = await axios.post('home/documents', docData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
  })
  return data
}

export const useAddDocument = () => {
  return useMutation((payload: unknown) => addDocuments(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(docQKeys.documents)
    },
  })
}

export const editDocuments = async (docData: {
  data: unknown
  id: string | number
}) => {
  const { data } = await axios.post(
    `home/documents/update/${docData.id}`,
    docData.data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    },
  )
  return data
}

export const useEditDocument = () => {
  return useMutation(
    (payload: { data: unknown; id: string | number }) => editDocuments(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(docQKeys.documents)
      },
    },
  )
}
