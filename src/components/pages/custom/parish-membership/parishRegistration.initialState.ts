import type { AdultMember, ChildMember, ParishRegistrationFormData, Sacraments } from './parishRegistration.types';

const createSacraments = (): Sacraments => ({
  baptism: { received: false, date: '' },
  eucharist: { received: false, date: '' },
  reconciliation: { received: false, date: '' },
  confirmation: { received: false, date: '' }
});

export const createAdultMember = (): AdultMember => ({
  parishStatus: '',
  role: '',
  firstName: '',
  nickname: '',
  maidenName: '',
  gender: '',
  dateOfBirth: '',
  email: '',
  workPhone: '',
  cellPhone: '',
  firstLanguage: '',
  occupation: '',
  employer: '',
  birthplace: '',
  isCatholic: '',
  maritalStatus: '',
  validCatholicMarriage: '',
  sacraments: createSacraments()
});

export const createChildMember = (): ChildMember => ({
  firstName: '',
  lastName: '',
  gender: '',
  birthdate: '',
  birthplace: '',
  relationshipToHeadOfHousehold: '',
  school: '',
  highSchoolGraduationYear: '',
  firstLanguage: '',
  isCatholic: '',
  sacraments: createSacraments()
});

export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, '0');
  const date = `${today.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${date}`;
};

export const createParishRegistrationInitialState = (): ParishRegistrationFormData => ({
  family: {
    registrationDate: getTodayDateString(),
    envelopeNumber: '',
    lastName: '',
    firstNames: '',
    mailingName: '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    homePhone: '',
    emergencyPhone: '',
    familyEmail: ''
  },
  adults: [createAdultMember(), createAdultMember()],
  children: [],
  additional: {
    priestVisitRequested: '',
    priestVisitDetails: ''
  }
});
