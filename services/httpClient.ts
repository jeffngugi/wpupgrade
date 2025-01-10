import axios from 'axios'
import { authHeader, authParams } from '../helpers/authHelper'
import store from '~store'

const {
  user: { user },
  environments: { current, environments },
} = store.getState()

export const axiosAuthApi = axios.create({
  baseURL: environments[current],
  timeout: 10000,
  headers: {},
})

export const axiosApi = axios.create({
  baseURL: environments[current],
  timeout: 30000,
  headers: {},
})

axiosApi.interceptors.response.use(
  function (response: any) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error: any) {
    return Promise.reject(error)
  },
)

export async function get<T = any>(url: string, config = {}): Promise<T> {
  return await axiosApi
    .get(url, {
      params: { ...(await authParams), ...config },
      headers: { ...(await authHeader()) },
    })
    .then((response: any) => response)
}

export async function patch(url: string, data: any, config = {}) {
  return await axiosApi
    .patch(url, { ...data }, { ...config, headers: await authHeader() })
    .then((response: any) => response)
    .catch((error: { response: any }) => error.response)
}

export async function post(url: string, data: any, config = {}) {
  return axiosApi
    .post(
      url,
      { ...data },
      {
        params: { ...(await authParams), ...config },
        headers: await authHeader(),
      },
    )
    .then((response: any) => response)
}

export async function postFormData(url: string, data: any, config = {}) {
  const axiosConfig = {
    params: { ...authParams, ...config },
    headers: {
      ...(await authHeader()),
      ...{
        'content-type': 'multipart/form-data',
      },
    },
  }

  return axiosApi.post(url, data, axiosConfig).then((response: any) => response)
}

export async function put(url: string, data: any, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config, headers: await authHeader() })
    .then((response: any) => response)
}

export async function del(url: string, config = {}) {
  const axiosConfig = {
    params: { ...authParams, ...config },
    headers: {
      ...(await authHeader()),
    },
  }
  return await axiosApi
    // eslint-disable-next-line no-undef
    .delete(url, axiosConfig)
    .then((response: any) => response)
}
