import EmailIcon from '@mui/icons-material/Email';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import Box from '@mui/material/Box';
import type { ChurchDetails } from '../../../interface';
import styled from '../../../util/styled.util';

export const StyledContactDetails = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
  fontsize: 16px;
`;

export const StyledChurchDetailsLinkWrapper = styled('a')(
  ({ theme }) => `
    display: flex;

    ${theme.breakpoints.down('md')} {
      justify-content: center;
    }
  `
);

export const StyledChurchDetailsLink = styled('a')(
  ({ theme }) => `
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #bf303c;
    font-size: 16px;
    line-height: 22px;
    font-weight: bold;

    &:hover {
      color: #822129;
      text-decoration: underline;
    }

    ${theme.breakpoints.down('md')} {
      justify-content: center;
    }
  `
);

export const StyledAddress = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 8px;

    ${theme.breakpoints.down('md')} {
      text-align: center;
    }
  `
);

interface ContactDetailsProps {
  churchDetails: ChurchDetails;
}

const ContactDetails = ({ churchDetails }: ContactDetailsProps) => {
  return (
    <StyledContactDetails>
      <StyledAddress>
        <Box>
          <strong>{churchDetails.name}</strong>
        </Box>
        <Box>{churchDetails.address}</Box>
        <Box>
          {churchDetails.city}, {churchDetails.state} {churchDetails.zipcode}
        </Box>
      </StyledAddress>
      <StyledChurchDetailsLinkWrapper>
        <StyledChurchDetailsLink href={`tel:${churchDetails.phone}`}>
          <PhoneEnabledIcon fontSize="small" />
          {churchDetails.phone}
        </StyledChurchDetailsLink>
      </StyledChurchDetailsLinkWrapper>
      <StyledChurchDetailsLinkWrapper>
        <StyledChurchDetailsLink href={`mailto:${churchDetails.email}`} target="_blank" rel="noreferrer">
          <EmailIcon fontSize="small" />
          {churchDetails.email}
        </StyledChurchDetailsLink>
      </StyledChurchDetailsLinkWrapper>
    </StyledContactDetails>
  );
};

export default ContactDetails;
