import { SetExpenseItem } from "~declarations";
import { TExpenseItem } from "~screens/expenses/types";
import ActionTypes from '~store/actions/types'

export const setExpenseItem = (payload: TExpenseItem): SetExpenseItem => ({
    type: ActionTypes.SET_EXPENSE_ITEM,
    payload,
});
