export const LOAN_STATUSES = {
  ALL: '',
  PENDING: 'PENDING,CERTIFIED',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED,COMPLETED_BY_TOPUP,MARKED_AS_COMPLETED',
}

const statusMapper = [
  {
    lable: 'Pending',
    colorCode: '#F3B744',
    identifier: 'PENDING',
    accessor: 'status',
  },
  {
    lable: 'Pending',
    colorCode: '#F3B744',
    identifier: 'CERTIFIED',
    accessor: 'status',
  },
  {
    lable: 'Active',
    colorCode: '#62A446',
    identifier: 'ACTIVE',
    accessor: 'status',
  },
  {
    lable: 'Disapproved',
    colorCode: '#F14B3B',
    identifier: 'INACTIVE',
    accessor: 'status',
  },
  {
    lable: 'Paused',
    colorCode: '#536171',
    identifier: 'PAUSED',
    accessor: 'status',
  },
  {
    lable: 'Paid',
    colorCode: '#3E8BEF',
    identifier: 'PAID',
    accessor: 'status',
  },
  {
    lable: 'Completed',
    colorCode: '#3E8BEF',
    identifier: 'COMPLETED',
    accessor: 'status',
  },
  {
    lable: 'Completed',
    colorCode: '#3E8BEF',
    identifier: 'COMPLETED_BY_TOPUP',
    accessor: 'status',
  },
  {
    lable: 'Marked as Completed',
    colorCode: '#3E8BEF',
    identifier: 'MARKED_AS_COMPLETED',
    accessor: 'status',
  },
]

export { statusMapper }
