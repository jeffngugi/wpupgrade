import { combineReducers } from 'redux'

import locale from './Locale'
import notifications from './Notifications'
import environments from './Environments'
import onboarding from './Onboarding'
import user from './User'
import application from './Application'
import ta from './TA'
import network from './Network'
import expenses from './Expenses'

const reducer = combineReducers({
  locale,
  notifications,
  environments,
  onboarding,
  user,
  application,
  ta,
  network,
  expenses,
})

export default reducer
