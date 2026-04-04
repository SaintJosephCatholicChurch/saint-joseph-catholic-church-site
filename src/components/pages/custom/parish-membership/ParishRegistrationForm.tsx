import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { useCallback, useMemo, useState } from 'react';

import { PARISH_REGISTRATION_URL } from '../../../../constants';
import getContainerQuery from '../../../../util/container.util';
import transientOptions from '../../../../util/transientOptions';
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PARISH_STATUS_OPTIONS,
  SACRAMENT_FIELDS,
  YES_NO_OPTIONS
} from './parishRegistration.constants';
import { createChildMember, createParishRegistrationInitialState } from './parishRegistration.initialState';
import { validateParishRegistration } from './parishRegistration.validation';

import type {
  AdultMember,
  ChildMember,
  ParishRegistrationFormData,
  SacramentRecord,
  SacramentKey,
  ValidationErrors
} from './parishRegistration.types';
import type { FormEventHandler } from 'react';

const StyledFormWrapper = styled('div')`
  position: relative;
  display: flex;
  width: 100%;
`;

interface StyledParishRegistrationFormProps {
  $submitted: boolean;
}

const StyledParishRegistrationForm = styled(
  'form',
  transientOptions
)<StyledParishRegistrationFormProps>(
  ({ $submitted }) => `
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;

    ${
      $submitted
        ? `
          opacity: 0.35;
          pointer-events: none;
        `
        : ''
    }
  `
);

interface StyledSubmittedMessageProps {
  $submitted: boolean;
}

const StyledSubmittedMessage = styled(
  'div',
  transientOptions
)<StyledSubmittedMessageProps>(
  ({ $submitted }) => `
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 16px;
    font-size: 24px;
    background: rgba(255, 255, 255, 0.9);
    z-index: 1;

    ${
      !$submitted
        ? `
          visibility: hidden;
          pointer-events: none;
        `
        : ''
    }
  `
);

const StyledSection = styled('section')`
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  padding: 24px;
  background-color: #fff;
`;

const StyledSectionTitle = styled('h2')`
  margin: 0 0 24px;
  color: #bf303c;
  font-size: 24px;
  line-height: 24px;
  text-transform: uppercase;
`;

const StyledSubsectionTitle = styled('h3')`
  margin: 0 0 16px;
  color: #616169;
  font-size: 20px;
  margin-top: 4px;
  margin-bottom: 0;
`;

const StyledFieldGrid = styled('div')(
  ({ theme }) => `
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 16px;

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      grid-template-columns: 1fr;
    }
  `
);

const StyledWideField = styled('div')`
  grid-column: 1 / -1;
`;

const StyledMemberCard = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 16px;

  & + & {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
  }
`;

const StyledSacramentGrid = styled('div')(
  ({ theme }) => `
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px 16px;
    margin: 0;

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      grid-template-columns: 1fr;
    }
  `
);

const StyledSacramentRow = styled('div')`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
  align-items: center;
`;

const StyledSectionActions = styled('div')`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const getFieldError = (errors: ValidationErrors, submitAttempted: boolean, path: string): string | undefined => {
  if (!submitAttempted) {
    return undefined;
  }

  return errors[path];
};

const isChildMemberBlank = (child: ChildMember): boolean => {
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
  ].some((value) => value.trim() !== '');

  if (hasCoreDetails) {
    return false;
  }

  return (Object.values(child.sacraments) as SacramentRecord[]).every(
    (sacrament) => !sacrament.received && sacrament.date.trim() === ''
  );
};

const ParishRegistrationForm = () => {
  const [formData, setFormData] = useState<ParishRegistrationFormData>(createParishRegistrationInitialState);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  const sanitizedFormData = useMemo(
    () => ({
      ...formData,
      children: formData.children.filter((child) => !isChildMemberBlank(child))
    }),
    [formData]
  );

  const errors = useMemo(() => validateParishRegistration(sanitizedFormData), [sanitizedFormData]);
  const valid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const updateFamily = useCallback((field: keyof ParishRegistrationFormData['family'], value: string) => {
    setFormData((current) => ({
      ...current,
      family: {
        ...current.family,
        [field]: value
      }
    }));
  }, []);

  const updateAdult = useCallback((index: number, field: keyof AdultMember, value: string) => {
    setFormData((current) => ({
      ...current,
      adults: current.adults.map((adult, adultIndex) =>
        adultIndex === index
          ? {
              ...adult,
              [field]: value
            }
          : adult
      )
    }));
  }, []);

  const updateChild = useCallback((index: number, field: keyof ChildMember, value: string) => {
    setFormData((current) => ({
      ...current,
      children: current.children.map((child, childIndex) =>
        childIndex === index
          ? {
              ...child,
              [field]: value
            }
          : child
      )
    }));
  }, []);

  const updateAdultSacrament = useCallback(
    (index: number, sacramentKey: SacramentKey, field: 'received' | 'date', value: boolean | string) => {
      setFormData((current) => ({
        ...current,
        adults: current.adults.map((adult, adultIndex) =>
          adultIndex === index
            ? {
                ...adult,
                sacraments: {
                  ...adult.sacraments,
                  [sacramentKey]: {
                    ...adult.sacraments[sacramentKey],
                    [field]: value,
                    ...(field === 'received' && value === false ? { date: '' } : {})
                  }
                }
              }
            : adult
        )
      }));
    },
    []
  );

  const updateChildSacrament = useCallback(
    (index: number, sacramentKey: SacramentKey, field: 'received' | 'date', value: boolean | string) => {
      setFormData((current) => ({
        ...current,
        children: current.children.map((child, childIndex) =>
          childIndex === index
            ? {
                ...child,
                sacraments: {
                  ...child.sacraments,
                  [sacramentKey]: {
                    ...child.sacraments[sacramentKey],
                    [field]: value,
                    ...(field === 'received' && value === false ? { date: '' } : {})
                  }
                }
              }
            : child
        )
      }));
    },
    []
  );

  const updateAdditional = useCallback((field: keyof ParishRegistrationFormData['additional'], value: string) => {
    setFormData((current) => ({
      ...current,
      additional: {
        ...current.additional,
        [field]: value,
        ...(field === 'priestVisitRequested' && value !== 'yes' ? { priestVisitDetails: '' } : {})
      }
    }));
  }, []);

  const addChild = useCallback(() => {
    setFormData((current) => ({
      ...current,
      children: [...current.children, createChildMember()]
    }));
  }, []);

  const removeChild = useCallback((index: number) => {
    setFormData((current) => ({
      ...current,
      children: current.children.filter((_, childIndex) => childIndex !== index)
    }));
  }, []);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      setSubmitAttempted(true);
      setSubmitError('');

      if (!valid) {
        return;
      }

      void (async () => {
        setInProgress(true);

        try {
          const response = await fetch(PARISH_REGISTRATION_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(sanitizedFormData)
          });
          const responseContentType = response.headers.get('content-type') ?? '';
          const responseBody: { message?: string } = responseContentType.includes('application/json')
            ? ((await response.json()) as { message?: string })
            : { message: await response.text() };

          if (!response.ok) {
            throw new Error(responseBody.message ?? 'Unable to submit parish registration.');
          }

          setSubmitted(true);
        } catch (error) {
          setSubmitError(error instanceof Error ? error.message : 'Unable to submit parish registration.');
        } finally {
          setInProgress(false);
        }
      })();
    },
    [sanitizedFormData, valid]
  );

  const renderSacramentFields = useCallback(
    (memberType: 'adults' | 'children', memberIndex: number, member: AdultMember | ChildMember) => {
      return (
        <>
          <StyledSubsectionTitle>Sacramental Information</StyledSubsectionTitle>
          <StyledSacramentGrid>
            {SACRAMENT_FIELDS.map(({ key, label }) => {
              const sacramentKey = key as SacramentKey;
              const sacrament = member.sacraments[sacramentKey];
              const receivedError = getFieldError(
                errors,
                submitAttempted,
                `${memberType}.${memberIndex}.sacraments.${sacramentKey}.received`
              );
              const dateError = getFieldError(
                errors,
                submitAttempted,
                `${memberType}.${memberIndex}.sacraments.${sacramentKey}.date`
              );

              return (
                <StyledSacramentRow key={`${memberType}-${memberIndex}-${sacramentKey}`}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sacrament.received}
                        onChange={(event) => {
                          if (memberType === 'adults') {
                            updateAdultSacrament(memberIndex, sacramentKey, 'received', event.target.checked);
                            return;
                          }

                          updateChildSacrament(memberIndex, sacramentKey, 'received', event.target.checked);
                        }}
                        disabled={inProgress || submitted}
                      />
                    }
                    label={label}
                  />
                  <TextField
                    label={`${label} Date`}
                    type="date"
                    size="small"
                    fullWidth
                    value={sacrament.date}
                    error={Boolean(receivedError || dateError)}
                    helperText={receivedError ?? dateError}
                    InputLabelProps={{ shrink: true }}
                    disabled={!sacrament.received || inProgress || submitted}
                    onChange={(event) => {
                      if (memberType === 'adults') {
                        updateAdultSacrament(memberIndex, sacramentKey, 'date', event.target.value);
                        return;
                      }

                      updateChildSacrament(memberIndex, sacramentKey, 'date', event.target.value);
                    }}
                  />
                </StyledSacramentRow>
              );
            })}
          </StyledSacramentGrid>
        </>
      );
    },
    [errors, inProgress, submitAttempted, submitted, updateAdultSacrament, updateChildSacrament]
  );

  return (
    <StyledFormWrapper>
      <StyledSubmittedMessage $submitted={submitted}>
        <CheckCircleIcon color="success" sx={{ fontSize: '72px' }} />
        <div>Parish registration successfully submitted.</div>
      </StyledSubmittedMessage>
      <StyledParishRegistrationForm onSubmit={onSubmit} $submitted={submitted}>
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

        <StyledSection>
          <StyledSectionTitle>Family Information</StyledSectionTitle>
          <StyledFieldGrid>
            <TextField
              label="Last Name"
              size="small"
              fullWidth
              required
              value={formData.family.lastName}
              error={Boolean(getFieldError(errors, submitAttempted, 'family.lastName'))}
              helperText={getFieldError(errors, submitAttempted, 'family.lastName')}
              onChange={(event) => updateFamily('lastName', event.target.value)}
              disabled={inProgress || submitted}
            />
            <TextField
              label="First Name(s)"
              size="small"
              fullWidth
              value={formData.family.firstNames}
              onChange={(event) => updateFamily('firstNames', event.target.value)}
              disabled={inProgress || submitted}
            />
            <StyledWideField>
              <TextField
                label="Mailing Name"
                size="small"
                fullWidth
                value={formData.family.mailingName}
                onChange={(event) => updateFamily('mailingName', event.target.value)}
                disabled={inProgress || submitted}
              />
            </StyledWideField>
            <StyledWideField>
              <TextField
                label="Address"
                size="small"
                fullWidth
                required
                value={formData.family.address}
                error={Boolean(getFieldError(errors, submitAttempted, 'family.address'))}
                helperText={getFieldError(errors, submitAttempted, 'family.address')}
                onChange={(event) => updateFamily('address', event.target.value)}
                disabled={inProgress || submitted}
              />
            </StyledWideField>
            <StyledWideField>
              <TextField
                label="Address Line 2"
                size="small"
                fullWidth
                value={formData.family.addressLine2}
                onChange={(event) => updateFamily('addressLine2', event.target.value)}
                disabled={inProgress || submitted}
              />
            </StyledWideField>
            <TextField
              label="City"
              size="small"
              fullWidth
              value={formData.family.city}
              onChange={(event) => updateFamily('city', event.target.value)}
              disabled={inProgress || submitted}
            />
            <TextField
              label="State"
              size="small"
              fullWidth
              value={formData.family.state}
              onChange={(event) => updateFamily('state', event.target.value)}
              disabled={inProgress || submitted}
            />
            <TextField
              label="Zip"
              size="small"
              fullWidth
              value={formData.family.zip}
              onChange={(event) => updateFamily('zip', event.target.value)}
              disabled={inProgress || submitted}
            />
            <TextField
              label="Home Phone"
              type="tel"
              size="small"
              fullWidth
              value={formData.family.homePhone}
              onChange={(event) => updateFamily('homePhone', event.target.value)}
              disabled={inProgress || submitted}
            />
            <TextField
              label="Emergency Phone"
              type="tel"
              size="small"
              fullWidth
              value={formData.family.emergencyPhone}
              onChange={(event) => updateFamily('emergencyPhone', event.target.value)}
              disabled={inProgress || submitted}
            />
            <TextField
              label="Family Email"
              type="email"
              size="small"
              fullWidth
              required
              value={formData.family.familyEmail}
              error={Boolean(getFieldError(errors, submitAttempted, 'family.familyEmail'))}
              helperText={getFieldError(errors, submitAttempted, 'family.familyEmail')}
              onChange={(event) => updateFamily('familyEmail', event.target.value)}
              disabled={inProgress || submitted}
            />
          </StyledFieldGrid>
        </StyledSection>

        {formData.adults.map((adult, index) => (
          <StyledSection key={`adult-${index}`}>
            <StyledSectionTitle>{`Adult Member ${index + 1}`}</StyledSectionTitle>
            <StyledMemberCard>
              <StyledFieldGrid>
                <TextField
                  label="First Name / Nickname"
                  size="small"
                  fullWidth
                  value={adult.firstNameNickname}
                  onChange={(event) => updateAdult(index, 'firstNameNickname', event.target.value)}
                  disabled={inProgress || submitted}
                />
                <TextField
                  select
                  label="Gender"
                  size="small"
                  fullWidth
                  value={adult.gender}
                  onChange={(event) => updateAdult(index, 'gender', event.target.value)}
                  disabled={inProgress || submitted}
                >
                  {GENDER_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Date of Birth"
                  type="date"
                  size="small"
                  fullWidth
                  value={adult.dateOfBirth}
                  error={Boolean(getFieldError(errors, submitAttempted, `adults.${index}.dateOfBirth`))}
                  helperText={getFieldError(errors, submitAttempted, `adults.${index}.dateOfBirth`)}
                  InputLabelProps={{ shrink: true }}
                  onChange={(event) => updateAdult(index, 'dateOfBirth', event.target.value)}
                  disabled={inProgress || submitted}
                />
                <TextField
                  select
                  label="Marital Status"
                  size="small"
                  fullWidth
                  value={adult.maritalStatus}
                  onChange={(event) => updateAdult(index, 'maritalStatus', event.target.value)}
                  disabled={inProgress || submitted}
                >
                  {MARITAL_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Valid Catholic Marriage"
                  size="small"
                  fullWidth
                  value={adult.validCatholicMarriage}
                  onChange={(event) => updateAdult(index, 'validCatholicMarriage', event.target.value)}
                  disabled={inProgress || submitted}
                >
                  {YES_NO_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Parish Status"
                  size="small"
                  fullWidth
                  value={adult.parishStatus}
                  onChange={(event) => updateAdult(index, 'parishStatus', event.target.value)}
                  disabled={inProgress || submitted}
                >
                  {PARISH_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Role"
                  size="small"
                  fullWidth
                  value={adult.role}
                  onChange={(event) => updateAdult(index, 'role', event.target.value)}
                  disabled={inProgress || submitted}
                />
                <TextField
                  label="Occupation / Employer"
                  size="small"
                  fullWidth
                  value={adult.occupationEmployer}
                  onChange={(event) => updateAdult(index, 'occupationEmployer', event.target.value)}
                  disabled={inProgress || submitted}
                />
                <TextField
                  label="Work Phone / Cell"
                  type="tel"
                  size="small"
                  fullWidth
                  value={adult.workPhoneOrCell}
                  onChange={(event) => updateAdult(index, 'workPhoneOrCell', event.target.value)}
                  disabled={inProgress || submitted}
                />
                <TextField
                  label="Email"
                  type="email"
                  size="small"
                  fullWidth
                  value={adult.email}
                  error={Boolean(getFieldError(errors, submitAttempted, `adults.${index}.email`))}
                  helperText={getFieldError(errors, submitAttempted, `adults.${index}.email`)}
                  onChange={(event) => updateAdult(index, 'email', event.target.value)}
                  disabled={inProgress || submitted}
                />
                <TextField
                  label="First Language"
                  size="small"
                  fullWidth
                  value={adult.firstLanguage}
                  onChange={(event) => updateAdult(index, 'firstLanguage', event.target.value)}
                  disabled={inProgress || submitted}
                />
                <TextField
                  label="Maiden Name"
                  size="small"
                  fullWidth
                  value={adult.maidenName}
                  onChange={(event) => updateAdult(index, 'maidenName', event.target.value)}
                  disabled={inProgress || submitted}
                />
                <TextField
                  label="Birthplace"
                  size="small"
                  fullWidth
                  value={adult.birthplace}
                  onChange={(event) => updateAdult(index, 'birthplace', event.target.value)}
                  disabled={inProgress || submitted}
                />
                <TextField
                  select
                  label="Catholic?"
                  size="small"
                  fullWidth
                  value={adult.isCatholic}
                  onChange={(event) => updateAdult(index, 'isCatholic', event.target.value)}
                  disabled={inProgress || submitted}
                >
                  {YES_NO_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </StyledFieldGrid>
              {renderSacramentFields('adults', index, adult)}
            </StyledMemberCard>
          </StyledSection>
        ))}

        <StyledSection>
          <StyledSectionTitle>Children / Dependents</StyledSectionTitle>

          {formData.children.map((child, index) => (
            <StyledMemberCard key={`child-${index}`}>
              <StyledSubsectionTitle>{`Child / Dependent ${index + 1}`}</StyledSubsectionTitle>
              <StyledFieldGrid>
                <TextField
                  label="First Name"
                  size="small"
                  fullWidth
                  value={child.firstName}
                  onChange={(event) => updateChild(index, 'firstName', event.target.value)}
                  disabled={inProgress || submitted}
                />
                <TextField
                  label="Last Name"
                  size="small"
                  fullWidth
                  value={child.lastName}
                  onChange={(event) => updateChild(index, 'lastName', event.target.value)}
                  disabled={inProgress || submitted}
                />
                <TextField
                  select
                  label="Gender"
                  size="small"
                  fullWidth
                  value={child.gender}
                  onChange={(event) => updateChild(index, 'gender', event.target.value)}
                  disabled={inProgress || submitted}
                >
                  {GENDER_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Birthdate"
                  type="date"
                  size="small"
                  fullWidth
                  value={child.birthdate}
                  error={Boolean(getFieldError(errors, submitAttempted, `children.${index}.birthdate`))}
                  helperText={getFieldError(errors, submitAttempted, `children.${index}.birthdate`)}
                  InputLabelProps={{ shrink: true }}
                  onChange={(event) => updateChild(index, 'birthdate', event.target.value)}
                  disabled={inProgress || submitted}
                />
                <StyledWideField>
                  <TextField
                    label="Relationship To Head of Household"
                    size="small"
                    fullWidth
                    value={child.relationshipToHeadOfHousehold}
                    onChange={(event) => updateChild(index, 'relationshipToHeadOfHousehold', event.target.value)}
                    disabled={inProgress || submitted}
                  />
                </StyledWideField>
                <TextField
                  label="School"
                  size="small"
                  fullWidth
                  value={child.school}
                  onChange={(event) => updateChild(index, 'school', event.target.value)}
                  disabled={inProgress || submitted}
                />
                <TextField
                  label="H.S. Grad Yr"
                  size="small"
                  fullWidth
                  value={child.highSchoolGraduationYear}
                  onChange={(event) => updateChild(index, 'highSchoolGraduationYear', event.target.value)}
                  disabled={inProgress || submitted}
                />
                <TextField
                  label="First Language"
                  size="small"
                  fullWidth
                  value={child.firstLanguage}
                  onChange={(event) => updateChild(index, 'firstLanguage', event.target.value)}
                  disabled={inProgress || submitted}
                />
                <TextField
                  select
                  label="Catholic?"
                  size="small"
                  fullWidth
                  value={child.isCatholic}
                  onChange={(event) => updateChild(index, 'isCatholic', event.target.value)}
                  disabled={inProgress || submitted}
                >
                  {YES_NO_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </StyledFieldGrid>
              {renderSacramentFields('children', index, child)}
              <StyledSectionActions>
                <Button
                  type="button"
                  variant="outlined"
                  color="inherit"
                  onClick={() => removeChild(index)}
                  disabled={inProgress || submitted}
                >
                  Remove Child
                </Button>
              </StyledSectionActions>
            </StyledMemberCard>
          ))}

          <StyledSectionActions>
            <Button type="button" variant="outlined" onClick={addChild} disabled={inProgress || submitted}>
              Add Child / Dependent
            </Button>
          </StyledSectionActions>
        </StyledSection>

        <StyledSection>
          <StyledSectionTitle>Additional Information</StyledSectionTitle>
          <StyledFieldGrid>
            <StyledWideField>
              <TextField
                select
                label="Would any household member like to be visited by a priest?"
                size="small"
                fullWidth
                value={formData.additional.priestVisitRequested}
                onChange={(event) => updateAdditional('priestVisitRequested', event.target.value)}
                disabled={inProgress || submitted}
              >
                {YES_NO_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </StyledWideField>
            <StyledWideField>
              <TextField
                label="Priest Visit Details"
                size="small"
                fullWidth
                multiline
                rows={3}
                value={formData.additional.priestVisitDetails}
                onChange={(event) => updateAdditional('priestVisitDetails', event.target.value)}
                disabled={formData.additional.priestVisitRequested !== 'yes' || inProgress || submitted}
              />
            </StyledWideField>
          </StyledFieldGrid>
        </StyledSection>

        <StyledSectionActions>
          <Button
            type="submit"
            variant="contained"
            disabled={inProgress || submitted}
            sx={{
              width: '220px',
              backgroundColor: '#bf303c',
              '&:hover': {
                backgroundColor: '#822129',
                color: '#ccc'
              }
            }}
          >
            {inProgress ? 'Submitting...' : 'Submit Registration'}
          </Button>
        </StyledSectionActions>
      </StyledParishRegistrationForm>
    </StyledFormWrapper>
  );
};

export default ParishRegistrationForm;
