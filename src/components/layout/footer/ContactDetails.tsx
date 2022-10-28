import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import { EXTRA_EXTRA_SMALL_BREAKPOINT } from '../../../constants';

import type { ChurchDetails } from '../../../interface';

export const StyledContactDetails = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
  fontsize: 16px;
  margin-bottom: 16px;
`;

export const StyledChurchDetailsLinkWrapper = styled('div')(
  ({ theme }) => `
    display: flex;

    ${theme.breakpoints.down('md')} {
      justify-content: center;
    }

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)} {
      justify-content: left;
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
    word-break: break-word;

    &:hover {
      color: #822129;
      text-decoration: underline;
    }

    ${theme.breakpoints.down('md')} {
      justify-content: center;
    }

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)} {
      justify-content: left;
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
      margin-bottom: 16px;
    }

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)} {
      margin-bottom: 24px;
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
      <StyledChurchDetailsLinkWrapper>
        <StyledChurchDetailsLink
          href={`https://www.facebook.com/${churchDetails.facebook_page}`}
          target="_blank"
          rel="noreferrer"
          title={`Facebook - ${churchDetails.facebook_page}`}
        >
          <FacebookIcon fontSize="small" />
          {churchDetails.facebook_page}
        </StyledChurchDetailsLink>
      </StyledChurchDetailsLinkWrapper>
    </StyledContactDetails>
  );
};

export default ContactDetails;
