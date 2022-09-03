import EmailIcon from '@mui/icons-material/Email';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import Box from '@mui/material/Box';
import type { ChurchDetails } from '../../../interface';
import styled from '../../../util/styled.util';

const StyledContactDetails = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
  fontsize: 16px;
`;

const StyledChurchDetailsLink = styled('a')`
  display: flex;
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
`;

const StyledAddress = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
`;

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
      <Box>
        <StyledChurchDetailsLink href={`tel:${churchDetails.phone}`}>
          <PhoneEnabledIcon fontSize="small" />
          {churchDetails.phone}
        </StyledChurchDetailsLink>
      </Box>
      <Box>
        <StyledChurchDetailsLink href={`mailto:${churchDetails.email}`} target="_blank" rel="noreferrer">
          <EmailIcon fontSize="small" />
          {churchDetails.email}
        </StyledChurchDetailsLink>
      </Box>
    </StyledContactDetails>
  );
};

export default ContactDetails;
