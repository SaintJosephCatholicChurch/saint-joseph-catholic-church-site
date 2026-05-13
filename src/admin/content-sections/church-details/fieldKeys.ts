export const CHURCH_DETAILS_FIELD_KEYS = {
  additionalEmails: 'additionalEmails',
  additionalPhones: 'additionalPhones',
  address: 'address',
  city: 'city',
  contacts: 'contacts',
  email: 'email',
  facebookPage: 'facebookPage',
  googleMapLocation: 'googleMapLocation',
  missionStatement: 'missionStatement',
  name: 'name',
  onlineGivingUrl: 'onlineGivingUrl',
  phone: 'phone',
  state: 'state',
  visionStatement: 'visionStatement',
  zipcode: 'zipcode'
} as const;

export type ChurchDetailsFieldKey = (typeof CHURCH_DETAILS_FIELD_KEYS)[keyof typeof CHURCH_DETAILS_FIELD_KEYS];
