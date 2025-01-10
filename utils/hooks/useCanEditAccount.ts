import { useAccountSettings } from '~api/settings'

type Tfeature =
  | 'update_bio_data'
  | 'update_contact_details'
  | 'update_education_data'
  | 'update_profile_photo'

export function useCanEditAccount(feature: Tfeature): boolean {
  const { data, isLoading } = useAccountSettings()
  const settings = data?.data
  return isLoading ? false : !!settings[feature]
}
