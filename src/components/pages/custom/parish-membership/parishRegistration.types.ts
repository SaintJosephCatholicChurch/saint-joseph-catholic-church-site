export interface SacramentRecord {
  received: boolean;
  date: string;
}

export interface Sacraments {
  baptism: SacramentRecord;
  eucharist: SacramentRecord;
  reconciliation: SacramentRecord;
  confirmation: SacramentRecord;
}

export interface FamilyInformation {
  registrationDate: string;
  envelopeNumber: string;
  lastName: string;
  firstNames: string;
  mailingName: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  homePhone: string;
  emergencyPhone: string;
  familyEmail: string;
}

export interface AdultMember {
  parishStatus: string;
  role: string;
  firstName: string;
  nickname: string;
  maidenName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  workPhone: string;
  cellPhone: string;
  firstLanguage: string;
  occupation: string;
  employer: string;
  birthplace: string;
  isCatholic: string;
  sacraments: Sacraments;
}

export interface MarriageInformation {
  maritalStatus: string;
  validCatholicMarriage: string;
}

export interface ChildMember {
  firstName: string;
  lastName: string;
  gender: string;
  birthdate: string;
  birthplace: string;
  relationshipToHeadOfHousehold: string;
  school: string;
  highSchoolGraduationYear: string;
  firstLanguage: string;
  isCatholic: string;
  sacraments: Sacraments;
}

export interface AdditionalInformation {
  priestVisitRequested: string;
  priestVisitDetails: string;
}

export interface ParishRegistrationFormData {
  family: FamilyInformation;
  adults: AdultMember[];
  marriage: MarriageInformation;
  children: ChildMember[];
  additional: AdditionalInformation;
}

export type ValidationErrors = Record<string, string>;
export type SacramentKey = keyof Sacraments;
