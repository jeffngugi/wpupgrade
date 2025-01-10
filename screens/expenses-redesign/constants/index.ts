import { ExpenseRoutesRedesign } from "~types";


export const EXPENSE_STATUSES = {
  NOTPAID: 'NOTPAID',
  PAID: 'PAID',
}

const statusMapper = [
  {
    lable: 'Paid',
    colorCode: '#62A446',
    identifier: 'PAID',
    accessor: 'status',
  },
  {
    lable: 'Not Paid',
    colorCode: '#F3B744',
    identifier: 'NOTPAID',
    accessor: 'status',
  },
  {
    lable: 'Approved',
    colorCode: '#536171',
    identifier: 'approved',
    accessor: 'status',
  },
]

const utilityStatusMapper = [
  {
    lable: 'Open',
    colorCode: '#DBE6F5',
    textColorCode: '#064393',
    identifier: 'Open',
    accessor: 'status',
  },
  {
    lable: 'Closed',
    colorCode: '#E4E5E7',
    textColorCode: '#56595D',
    identifier: 'Closed',
    accessor: 'status',
  },
  {
    lable: 'Refunded',
    colorCode: '#FAE3B7',
    textColorCode: '#5C3D00',
    identifier: 'Refunded',
    accessor: 'status',
  },
]

export { statusMapper, utilityStatusMapper }
