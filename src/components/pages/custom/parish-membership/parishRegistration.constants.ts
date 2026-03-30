export const YES_NO_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

export const PARISH_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

export const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'separated', label: 'Separated' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'annulled', label: 'Annulled' },
  { value: 'widowed', label: 'Widowed' }
];

export const SACRAMENT_FIELDS = [
  { key: 'baptism', label: 'Baptism' },
  { key: 'eucharist', label: 'Eucharist' },
  { key: 'reconciliation', label: 'Reconciliation' },
  { key: 'confirmation', label: 'Confirmation' }
] as const;
