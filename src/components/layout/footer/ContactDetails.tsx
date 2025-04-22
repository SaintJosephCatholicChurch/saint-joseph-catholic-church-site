'use client';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

import { EXTRA_EXTRA_SMALL_BREAKPOINT } from '../../../constants';
import getContainerQuery from '../../../util/container.util';

import type { ChurchDetails } from '../../../interface';

export const StyledContactDetailsWrapper = styled('div')(
  ({ theme }) => `
    display: flex;
    gap: 20px;
    margin-bottom: 24px;

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      flex-direction: column;
    }
  `
);

export const StyledContactDetails = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
  fontsize: 16px;
`;

export const StyledChurchDetailsLinkWrapper = styled('div')(
  ({ theme }) => `
    display: flex;

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      justify-content: center;
    }

    ${getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT))} {
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
    whitespace: no-wrap;

    &:hover {
      color: #822129;
      text-decoration: underline;
    }

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      justify-content: flex-start;
    }

    ${getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT))} {
      justify-content: flex-start;
    }
  `
);

export const StyledAddress = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 8px;

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      text-align: center;
      margin-bottom: 16px;
    }

    ${getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT))} {
      margin-bottom: 24px;
    }
  `
);

export const StyledImageWrapper = styled('div')`
  display: flex;
  flex-grow: 1;
  justify-content: center;
`;

interface ContactDetailsProps {
  churchDetails: ChurchDetails;
}

const ContactDetails = ({ churchDetails }: ContactDetailsProps) => {
  return (
    <StyledContactDetailsWrapper>
      <StyledContactDetails>
        <StyledAddress>
          <div>
            <strong>{churchDetails.name}</strong>
          </div>
          <div>{churchDetails.address}</div>
          <div>
            {churchDetails.city}, {churchDetails.state} {churchDetails.zipcode}
          </div>
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
      <StyledImageWrapper>
        <Image src="/st-joseph-logo.webp" alt="St Joseph Logo" width={180} height={180} />
      </StyledImageWrapper>
    </StyledContactDetailsWrapper>
  );
};

export default ContactDetails;
