export const useLeaveStatus = (state: string) => {
  let status = 'Pending'
  let variant: 'pending' | 'failed' | 'success' = 'pending'
  switch (state) {
    case 'NOT_APPROVED':
    case 'NOT_CERTIFIED':
      status = 'Pending'
      variant = 'pending'
      break
    case 'INACTIVE':
      status = 'Inactive'
      variant = 'success'
      break
    case 'DISAPPROVED':
      status = 'Disapproved'
      variant = 'failed'
      break
    case 'ACTIVE':
      status = 'Active'
      variant = 'success'
      break
    case 'APPROVED':
      status = 'Approved'
      variant = 'success'
      break
    default:
      break
  }
  return { status, variant }
}
