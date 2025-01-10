import { ExpenseAction } from '~declarations'
import ActionTypes from '~store/actions/types'

const currentState = {
    expenseItem: null,
    expenseItems: [],
}

const reducer = (state = currentState, action: ExpenseAction) => {
    switch (action.type) {
        case ActionTypes.SET_EXPENSE_ITEM:
            return {
                ...state,
                expenseItem: action.payload,
            }

        default:
            return state
    }
}

export default reducer