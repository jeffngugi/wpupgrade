import store from '~store'

export const authHeader = async () => {
  const {
    user: { user },
  } = store.getState()

  if (user.token != null) {
    return { Authorization: `Bearer ${user.token}` }
  } else {
    return {}
  }
}

export const authParams: object = async () => {
  const {
    user: { user },
  } = store.getState()

  if (user) {
    return {
      auth_company_id: user.company_id,
      auth_employee_id: user.employee_id,
      id: user.id,
      authorize_for: 'employee',
      token: user.token,
    }
  } else {
    return {}
  }
}

export function getAuthParams() {
  const {
    user: { user },
  } = store.getState()

  if (user) {
    return {
      auth_company_id: user.company_id,
      auth_employee_id: user.employee_id,
      // id: user.id,
      authorize_for: 'employee',
      token: user.token,
    }
  } else {
    return {}
  }
}

export type EmployeeAuthParams = {
  auth_company_id: number
  auth_employee_id: number
  authorize_for: string
}

export async function getEmployeeParams() {
  const {
    user: { user },
  } = store.getState()

  if (user) {
    return {
      auth_company_id: user.company_id,
      auth_employee_id: user.employee_id,
      authorize_for: 'employee',
    }
  } else {
    return {}
  }
}
