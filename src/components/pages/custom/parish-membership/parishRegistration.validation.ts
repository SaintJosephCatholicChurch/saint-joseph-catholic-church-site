import { isNotEmpty } from '../../../../util/string.util';
import { SACRAMENT_FIELDS } from './parishRegistration.constants';

import type { ParishRegistrationFormData, SacramentKey, ValidationErrors } from './parishRegistration.types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isValidDateString = (value: string): boolean => {
  if (!DATE_REGEX.test(value)) {
    return false;
  }

  const parsedDate = new Date(value);
  return !Number.isNaN(parsedDate.getTime());
};

export const validateParishRegistration = (formData: ParishRegistrationFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!isNotEmpty(formData.family.lastName.trim())) {
    errors['family.lastName'] = 'Last name is required.';
  }

  if (!isNotEmpty(formData.family.address.trim())) {
    errors['family.address'] = 'Address is required.';
  }

  if (!isNotEmpty(formData.family.familyEmail.trim())) {
    errors['family.familyEmail'] = 'Family email is required.';
  } else if (!EMAIL_REGEX.test(formData.family.familyEmail.trim())) {
    errors['family.familyEmail'] = 'Enter a valid email address.';
  }

  if (isNotEmpty(formData.family.registrationDate) && !isValidDateString(formData.family.registrationDate)) {
    errors['family.registrationDate'] = 'Enter a valid registration date.';
  }

  formData.adults.forEach((adult, adultIndex) => {
    if (isNotEmpty(adult.email.trim()) && !EMAIL_REGEX.test(adult.email.trim())) {
      errors[`adults.${adultIndex}.email`] = 'Enter a valid adult email address.';
    }

    if (isNotEmpty(adult.dateOfBirth) && !isValidDateString(adult.dateOfBirth)) {
      errors[`adults.${adultIndex}.dateOfBirth`] = 'Enter a valid date of birth.';
    }

    SACRAMENT_FIELDS.forEach(({ key }) => {
      const sacramentKey = key as SacramentKey;
      const sacrament = adult.sacraments[sacramentKey];

      if (isNotEmpty(sacrament.date) && !isValidDateString(sacrament.date)) {
        errors[`adults.${adultIndex}.sacraments.${sacramentKey}.date`] = 'Enter a valid date.';
      }

      if (isNotEmpty(sacrament.date) && !sacrament.received) {
        errors[`adults.${adultIndex}.sacraments.${sacramentKey}.received`] =
          'Select the sacrament checkbox when a date is provided.';
      }
    });
  });

  formData.children.forEach((child, childIndex) => {
    if (isNotEmpty(child.birthdate) && !isValidDateString(child.birthdate)) {
      errors[`children.${childIndex}.birthdate`] = 'Enter a valid birthdate.';
    }

    SACRAMENT_FIELDS.forEach(({ key }) => {
      const sacramentKey = key as SacramentKey;
      const sacrament = child.sacraments[sacramentKey];

      if (isNotEmpty(sacrament.date) && !isValidDateString(sacrament.date)) {
        errors[`children.${childIndex}.sacraments.${sacramentKey}.date`] = 'Enter a valid date.';
      }

      if (isNotEmpty(sacrament.date) && !sacrament.received) {
        errors[`children.${childIndex}.sacraments.${sacramentKey}.received`] =
          'Select the sacrament checkbox when a date is provided.';
      }
    });
  });

  return errors;
};
