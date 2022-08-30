import styled from '@emotion/styled';
import EmailIcon from '@mui/icons-material/Email';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import Box from '@mui/material/Box';
import { ChurchDetails } from '../../../interface';

const ChurchDetailsLink = styled('a')`
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgb(104, 11, 18);
  font-size: 16px;
  line-height: 22px;
  font-weight: bold;

  &:hover {
    color: rgb(104, 11, 18);
    text-decoration: underline;
  }
`;

interface ContactDetailsProps {
  churchDetails: ChurchDetails;
}

const ContactDetails = ({ churchDetails }: ContactDetailsProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        fontSize: 16
      }}
    >
      <Box>
        <strong>{churchDetails.name}</strong>
      </Box>
      <Box>{churchDetails.address}</Box>
      <Box>
        {churchDetails.city}, {churchDetails.state} {churchDetails.zipcode}
      </Box>
      <Box>
        <ChurchDetailsLink href={`tel:${churchDetails.phone}`}>
          <PhoneEnabledIcon fontSize="small" />
          {churchDetails.phone}
        </ChurchDetailsLink>
      </Box>
      <Box>
        <ChurchDetailsLink href={`mailto:${churchDetails.email}`} target="_blank" rel="noreferrer">
          <EmailIcon fontSize="small" />
          {churchDetails.email}
        </ChurchDetailsLink>
      </Box>
    </Box>
  );
};

export default ContactDetails;
