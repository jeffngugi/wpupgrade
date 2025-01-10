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

const verificationStatusMapper = [
  {
    lable: 'Pending',
    colorCode: '#FFC107',
    identifier: 'Pending',
    accessor: 'status',
  },
  {
    lable: 'Approved',
    colorCode: '#62A446',
    identifier: 'Approved',
    accessor: 'status',
  },
  {
    lable: 'Rejected',
    colorCode: '#E74C3C',
    identifier: 'Rejected',
    accessor: 'status',
  },
  //verified
  {
    lable: 'Verified',
    colorCode: '#62A446',
    identifier: 'Verified',
    accessor: 'status',
  },
  //requested_changes
  {
    lable: 'Requested Changes',
    colorCode: '#FFC107',
    identifier: 'Requested_Changes',
    accessor: 'status',
  },
  //pending_verification
  {
    lable: 'Pending Verification',
    colorCode: '#FFC107',
    identifier: 'Pending_Verification',
    accessor: 'status',
  },
]

export { statusMapper, utilityStatusMapper, verificationStatusMapper }
