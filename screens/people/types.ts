export type TColleague = {
  id: number
  name: string
  avatar: string
  job_title: string
  email: string
  gender: string
  birthday: string
  date_employed: string
  length_of_service: string
  nationality: string
  phone: string
  leave_details: LeaveDetails | null
  created_at: string
  updated_at: string
}

export type LeaveDetails = {
  leave_from: string
  leave_to: string
  leave_days: string
  leave_reliever: string
}
export type TSortedColleague = {
  title: string
  data: TColleague[]
}
