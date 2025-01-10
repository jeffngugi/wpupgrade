export const useAdvanceStatus = (state: string, paid: 1 | 0) => {
  let status = 'Pending'
  let variant: 'pending' | 'failed' | 'success' = 'pending'
  if (state === 'APPROVED' && paid === 0) {
    status = 'Approved'
    variant = 'success'
  } else if (state === 'APPROVED' && paid === 1) {
    status = 'Paid'
    variant = 'success'
  } else if (state === 'DISAPPROVED') {
    status = 'Disapproved'
    variant = 'failed'
  } else if (state === 'CERTIFIED') {
    status = 'Requested'
  }
  return { status, variant }
}
