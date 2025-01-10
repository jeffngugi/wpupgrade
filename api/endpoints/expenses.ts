const EXPENSES = {
  ALL: 'hrm/petty-cash',
  CATEGORIES: 'hrm/petty-cash/expense/categories',
  ADD_EXPENSE: 'hrm/petty-cash',
  UPDATE_EXPENSE: (id: number) => `hrm/petty-cash/${id}`,
  DELETE_EXPENSE: (id: number) => `hrm/petty-cash/${id}`,
}

export { EXPENSES }
