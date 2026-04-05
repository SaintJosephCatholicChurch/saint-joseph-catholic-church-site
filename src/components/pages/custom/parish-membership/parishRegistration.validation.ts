import { isNotEmpty } from '../../../../util/string.util';
import {
  MARITAL_STATUS_OPTIONS,
  SACRAMENT_FIELDS,
  STATE_OPTIONS,
  YES_NO_OPTIONS
} from './parishRegistration.constants';

import type {
  ParishRegistrationFormData,
  SacramentKey,
  SacramentRecord,
  ValidationErrors
} from './parishRegistration.types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_REGEX = /^\(\d{3}\) \d{3}-\d{4}$/;
const ZIP_REGEX = /^\d{5}(?:-\d{4})?$/;
const STATE_VALUES = new Set(STATE_OPTIONS.map((option) => option.value));
const MARITAL_STATUS_VALUES = new Set(MARITAL_STATUS_OPTIONS.map((option) => option.value));
const YES_NO_VALUES = new Set(YES_NO_OPTIONS.map((option) => option.value));

const isValidDateString = (value: string): boolean => {
  if (!DATE_REGEX.test(value)) {
    return false;
  }

  const parsedDate = new Date(value);
  return !Number.isNaN(parsedDate.getTime());
};

const isValidPhoneString = (value: string): boolean => PHONE_REGEX.test(value);
const isValidZipString = (value: string): boolean => ZIP_REGEX.test(value);
const getStringValue = (value: unknown): string => (typeof value === 'string' ? value : '');
const getMarriageValue = (value: unknown, field: 'maritalStatus' | 'validCatholicMarriage'): string => {
  if (typeof value !== 'object' || value === null) {
    return '';
  }

  const rootRecord = value as Record<string, unknown>;
  const marriageValue = rootRecord.marriage;

  if (typeof marriageValue !== 'object' || marriageValue === null) {
    return '';
  }

  return getStringValue((marriageValue as Record<string, unknown>)[field]);
};

const isChildMemberBlank = (child: ParishRegistrationFormData['children'][number]): boolean => {
  const hasCoreDetails = [
    child.firstName,
    child.lastName,
    child.gender,
    child.birthdate,
    child.relationshipToHeadOfHousehold,
    child.school,
    child.highSchoolGraduationYear,
    child.firstLanguage,
    child.isCatholic
  ].some((value) => isNotEmpty(value.trim()));

  if (hasCoreDetails) {
    return false;
  }

  return (Object.values(child.sacraments) as SacramentRecord[]).every(
    (sacrament) => !sacrament.received && !isNotEmpty(sacrament.date.trim())
  );
};

export const validateParishRegistration = (formData: ParishRegistrationFormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  const marriageMaritalStatus = getMarriageValue(formData, 'maritalStatus').trim();
  const validCatholicMarriage = getMarriageValue(formData, 'validCatholicMarriage').trim();

  if (!isNotEmpty(formData.family.lastName.trim())) {
    errors['family.lastName'] = 'Last name is required.';
  }

  if (!isNotEmpty(formData.family.address.trim())) {
    errors['family.address'] = 'Address is required.';
  }

  if (!isNotEmpty(formData.family.city.trim())) {
    errors['family.city'] = 'City is required.';
  }

  if (!isNotEmpty(formData.family.state.trim())) {
    errors['family.state'] = 'State is required.';
  }

  if (!isNotEmpty(formData.family.familyEmail.trim())) {
    errors['family.familyEmail'] = 'Family email is required.';
  } else if (!EMAIL_REGEX.test(formData.family.familyEmail.trim())) {
    errors['family.familyEmail'] = 'Enter a valid email address.';
  }

  if (isNotEmpty(formData.family.registrationDate) && !isValidDateString(formData.family.registrationDate)) {
    errors['family.registrationDate'] = 'Enter a valid registration date.';
  }

  if (!isNotEmpty(formData.family.homePhone.trim())) {
    errors['family.homePhone'] = 'Home phone is required.';
  } else if (!isValidPhoneString(formData.family.homePhone.trim())) {
    errors['family.homePhone'] = 'Enter a 10-digit phone number including area code.';
  }

  if (isNotEmpty(formData.family.emergencyPhone) && !isValidPhoneString(formData.family.emergencyPhone.trim())) {
    errors['family.emergencyPhone'] = 'Enter a 10-digit phone number including area code.';
  }

  if (!isNotEmpty(formData.family.zip.trim())) {
    errors['family.zip'] = 'ZIP code is required.';
  } else if (!isValidZipString(formData.family.zip.trim())) {
    errors['family.zip'] = 'Enter a valid ZIP code.';
  }

  if (isNotEmpty(formData.family.state) && !STATE_VALUES.has(formData.family.state.trim())) {
    errors['family.state'] = 'Select a valid state.';
  }

  formData.adults.forEach((adult, adultIndex) => {
    if (!isNotEmpty(adult.parishStatus.trim())) {
      errors[`adults.${adultIndex}.parishStatus`] = 'Parish status is required.';
    }

    if (!isNotEmpty(adult.role.trim())) {
      errors[`adults.${adultIndex}.role`] = 'Role is required.';
    }

    if (!isNotEmpty(adult.firstName.trim())) {
      errors[`adults.${adultIndex}.firstName`] = 'First name is required.';
    }

    if (!isNotEmpty(adult.gender.trim())) {
      errors[`adults.${adultIndex}.gender`] = 'Gender is required.';
    }

    if (!isNotEmpty(adult.dateOfBirth.trim())) {
      errors[`adults.${adultIndex}.dateOfBirth`] = 'Date of birth is required.';
    }

    if (!isNotEmpty(adult.birthplace.trim())) {
      errors[`adults.${adultIndex}.birthplace`] = 'Birthplace is required.';
    }

    if (isNotEmpty(adult.email.trim()) && !EMAIL_REGEX.test(adult.email.trim())) {
      errors[`adults.${adultIndex}.email`] = 'Enter a valid adult email address.';
    }

    if (isNotEmpty(adult.workPhone) && !isValidPhoneString(adult.workPhone.trim())) {
      errors[`adults.${adultIndex}.workPhone`] = 'Enter a 10-digit phone number including area code.';
    }

    if (isNotEmpty(adult.cellPhone) && !isValidPhoneString(adult.cellPhone.trim())) {
      errors[`adults.${adultIndex}.cellPhone`] = 'Enter a 10-digit phone number including area code.';
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

  if (isNotEmpty(marriageMaritalStatus) && !MARITAL_STATUS_VALUES.has(marriageMaritalStatus)) {
    errors['marriage.maritalStatus'] = 'Select a valid marital status.';
  }

  if (isNotEmpty(validCatholicMarriage) && !YES_NO_VALUES.has(validCatholicMarriage)) {
    errors['marriage.validCatholicMarriage'] = 'Select a valid value.';
  }

  formData.children.forEach((child, childIndex) => {
    if (isChildMemberBlank(child)) {
      return;
    }

    const childBirthplace = getStringValue(child.birthplace);

    if (!isNotEmpty(child.relationshipToHeadOfHousehold.trim())) {
      errors[`children.${childIndex}.relationshipToHeadOfHousehold`] = 'Relationship to head of household is required.';
    }

    if (!isNotEmpty(child.firstName.trim())) {
      errors[`children.${childIndex}.firstName`] = 'First name is required.';
    }

    if (!isNotEmpty(child.lastName.trim())) {
      errors[`children.${childIndex}.lastName`] = 'Last name is required.';
    }

    if (!isNotEmpty(child.gender.trim())) {
      errors[`children.${childIndex}.gender`] = 'Gender is required.';
    }

    if (!isNotEmpty(child.birthdate.trim())) {
      errors[`children.${childIndex}.birthdate`] = 'Birthdate is required.';
    }

    if (!isNotEmpty(childBirthplace.trim())) {
      errors[`children.${childIndex}.birthplace`] = 'Birthplace is required.';
    }

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
