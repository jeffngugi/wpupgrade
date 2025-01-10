import axios from 'axios'
import store from '~store'

const {
  user: { user },
  environments: { current, environments },
} = store.getState()

const wpApi = axios.create({
  baseURL: environments[current],
  headers: {
    Authorization: `Bearer ${user.token}`,
  },
  params: {
    auth_company_id: user.company_id,
    auth_employee_id: user.employee_id,
    id: user.id,
    authorize_for: 'employee',
  },
})

//todo, create axios instance for updating headers if needed.

export default wpApi
