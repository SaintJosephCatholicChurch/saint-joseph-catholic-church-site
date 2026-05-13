import { Fragment } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import { getAdminPreviewFieldTargetProps } from '../../../../admin/content-sections/components/adminPreviewSelection';
import Container from '../../../../components/layout/Container';
import { StyledChurchDetailsLink, StyledContactDetails } from '../../../../components/layout/footer/ContactDetails';
import PageTitle from '../../../../components/pages/PageTitle';
import ContactForm from '../../../../components/pages/custom/contact/ContactForm';
import homePageData from '../../../../lib/homepage';
import getContainerQuery from '../../../../util/container.util';

import type { ChurchDetails } from '../../../../interface';

const StyledContactSection = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

const StyledContactContentWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

const StyledContactContent = styled('div')(
  ({ theme }) => `
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: flex-start;
    justify-content: flex-start;
    justify-self: center;
    width: 100%;
    gap: 40px;

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      grid-template-columns: 1fr;
    }
  `
);

const StyledWhereToFindUsSection = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  background:
    linear-gradient(183.55deg, #f1f1f1 3%, rgba(241, 241, 241, 0) 30%),
    url(${homePageData.schedule_section.schedule_background}), #c7c7c7;
  margin-top: 48px;
`;

const StyledWhereToFindUsContent = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  padding: 16px 0 36px;
`;

const StyledWhereToFindUsTitle = styled('h2')`
  margin-bottom: 32px;
  font-size: 28px;
`;

const StyledMapWrapper = styled('div')`
  position: relative;
  width: 100%;
`;

const StyledMap = styled('iframe')(
  ({ theme }) => `
    border: 0;
    width: 100%;
    height: 600px;

    ${getContainerQuery(theme.breakpoints.down('lg'))} {
      height: 500px;
    }

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      height: 400px;
    }

    ${getContainerQuery(theme.breakpoints.down('sm'))} {
      height: 200px;
    }
  `
);

const StyledChurchDetailSection = styled('div')(
  ({ theme }) => `
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 16px;
    margin-bottom: 16px;

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
`
);

const StyledChurchDetailTitle = styled('div')`
  font-weight: 700;
`;

const StyledChurchDetailContent = styled('div')`
  whitespace: no-wrap;
`;

const StyledAddress = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
`;

const StyledSocialLinks = styled('div')`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ACTIVE_PREVIEW_TARGET_STYLE = {
  backgroundColor: 'rgba(188, 47, 59, 0.1)',
  borderRadius: '4px',
  boxShadow: 'inset 0 0 0 1px rgba(127, 35, 44, 0.24)'
} as const;

function getActivePreviewTargetStyle(fieldKey: string, activeFieldKey?: string) {
  return activeFieldKey === fieldKey ? ACTIVE_PREVIEW_TARGET_STYLE : undefined;
}

interface ContactViewAdminSelection {
  activeFieldKey?: string;
  interactive?: boolean;
}

interface ContactViewProps {
  adminSelection?: ContactViewAdminSelection;
  churchDetails: ChurchDetails;
  disableForm?: boolean;
}

function getPreviewLinkProps(
  fieldKey: string,
  adminSelection: ContactViewAdminSelection | undefined,
  href: string,
  options?: {
    rel?: string;
    target?: string;
    title?: string;
  }
) {
  const interactive = adminSelection?.interactive;

  return {
    ...getAdminPreviewFieldTargetProps(fieldKey),
    href,
    rel: options?.rel,
    target: options?.target,
    title: options?.title,
    onClick: interactive
      ? (event: React.MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();
        }
      : undefined,
    style: {
      ...getActivePreviewTargetStyle(fieldKey, adminSelection?.activeFieldKey),
      ...(interactive ? { cursor: 'pointer' } : null)
    }
  };
}

const ContactView = ({ adminSelection, churchDetails, disableForm }: ContactViewProps) => {
  return (
    <>
      <StyledContactSection key="contact-section">
        <Container>
          <StyledContactContentWrapper>
            <PageTitle title="Contact" />
            <StyledContactContent>
              <StyledContactDetails>
                <StyledAddress>
                  <Box
                    {...getAdminPreviewFieldTargetProps('name')}
                    sx={getActivePreviewTargetStyle('name', adminSelection?.activeFieldKey)}
                  >
                    <strong>{churchDetails.name}</strong>
                  </Box>
                  <Box>
                    <span
                      {...getAdminPreviewFieldTargetProps('address')}
                      style={getActivePreviewTargetStyle('address', adminSelection?.activeFieldKey)}
                    >
                      {churchDetails.address}
                    </span>
                  </Box>
                  <Box>
                    <span
                      {...getAdminPreviewFieldTargetProps('city')}
                      style={getActivePreviewTargetStyle('city', adminSelection?.activeFieldKey)}
                    >
                      {churchDetails.city}
                    </span>
                    {', '}
                    <span
                      {...getAdminPreviewFieldTargetProps('state')}
                      style={getActivePreviewTargetStyle('state', adminSelection?.activeFieldKey)}
                    >
                      {churchDetails.state}
                    </span>{' '}
                    <span
                      {...getAdminPreviewFieldTargetProps('zipcode')}
                      style={getActivePreviewTargetStyle('zipcode', adminSelection?.activeFieldKey)}
                    >
                      {churchDetails.zipcode}
                    </span>
                  </Box>
                </StyledAddress>
                <StyledChurchDetailSection>
                  <StyledChurchDetailTitle
                    {...getAdminPreviewFieldTargetProps('phone')}
                    style={getActivePreviewTargetStyle('phone', adminSelection?.activeFieldKey)}
                  >
                    Church Phone
                  </StyledChurchDetailTitle>
                  <StyledChurchDetailsLink
                    {...getPreviewLinkProps('phone', adminSelection, `tel:${churchDetails.phone}`)}
                  >
                    <PhoneEnabledIcon fontSize="small" />
                    {churchDetails.phone}
                  </StyledChurchDetailsLink>
                  {churchDetails.additional_phones?.map((phone, index) => (
                    <>
                      <StyledChurchDetailTitle
                        key={`additional-phone-${index}-title`}
                        {...getAdminPreviewFieldTargetProps('additionalPhones')}
                        style={getActivePreviewTargetStyle('additionalPhones', adminSelection?.activeFieldKey)}
                      >
                        {phone.name}:
                      </StyledChurchDetailTitle>
                      <StyledChurchDetailsLink
                        key={`additional-phone-${index}-link`}
                        {...getPreviewLinkProps('additionalPhones', adminSelection, `tel:${phone.phone}`)}
                      >
                        <PhoneEnabledIcon fontSize="small" />
                        {phone.phone}
                      </StyledChurchDetailsLink>
                    </>
                  ))}
                  <StyledChurchDetailTitle
                    {...getAdminPreviewFieldTargetProps('email')}
                    style={getActivePreviewTargetStyle('email', adminSelection?.activeFieldKey)}
                  >
                    Church Email
                  </StyledChurchDetailTitle>
                  <StyledChurchDetailsLink
                    {...getPreviewLinkProps('email', adminSelection, `mailto:${churchDetails.email}`, {
                      rel: 'noreferrer',
                      target: '_blank'
                    })}
                  >
                    <EmailIcon fontSize="small" />
                    {churchDetails.email}
                  </StyledChurchDetailsLink>
                  {churchDetails.additional_emails?.map((email, index) => (
                    <>
                      <StyledChurchDetailTitle
                        key={`additional-email-${index}-title`}
                        {...getAdminPreviewFieldTargetProps('additionalEmails')}
                        style={getActivePreviewTargetStyle('additionalEmails', adminSelection?.activeFieldKey)}
                      >
                        {email.name}
                      </StyledChurchDetailTitle>
                      <StyledChurchDetailsLink
                        key={`additional-email-${index}-link`}
                        {...getPreviewLinkProps('additionalEmails', adminSelection, `mailto:${email.email}`)}
                      >
                        <EmailIcon fontSize="small" />
                        {email.email}
                      </StyledChurchDetailsLink>
                    </>
                  ))}
                </StyledChurchDetailSection>
                <StyledChurchDetailSection>
                  {churchDetails.contacts?.map((contact, index) => (
                    <Fragment key={`contact-${index}`}>
                      <StyledChurchDetailTitle
                        {...getAdminPreviewFieldTargetProps('contacts')}
                        style={getActivePreviewTargetStyle('contacts', adminSelection?.activeFieldKey)}
                      >
                        {contact.title}
                      </StyledChurchDetailTitle>
                      <StyledChurchDetailContent
                        {...getAdminPreviewFieldTargetProps('contacts')}
                        style={getActivePreviewTargetStyle('contacts', adminSelection?.activeFieldKey)}
                      >
                        {contact.name}
                      </StyledChurchDetailContent>
                    </Fragment>
                  ))}
                </StyledChurchDetailSection>
                <StyledSocialLinks>
                  <StyledChurchDetailsLink
                    {...getPreviewLinkProps(
                      'facebookPage',
                      adminSelection,
                      `https://www.facebook.com/${churchDetails.facebook_page}`,
                      {
                        rel: 'noreferrer',
                        target: '_blank',
                        title: `Facebook - ${churchDetails.facebook_page}`
                      }
                    )}
                  >
                    <FacebookIcon fontSize="large" />
                  </StyledChurchDetailsLink>
                </StyledSocialLinks>
              </StyledContactDetails>
              <ContactForm disableForm={disableForm} />
            </StyledContactContent>
          </StyledContactContentWrapper>
        </Container>
      </StyledContactSection>
      <StyledWhereToFindUsSection key="where-to-find-us-section">
        <Container>
          <StyledWhereToFindUsContent>
            <StyledWhereToFindUsTitle>Where to Find Us</StyledWhereToFindUsTitle>
            <StyledMapWrapper>
              <StyledMap
                src={churchDetails.google_map_location}
                style={{ border: 0, pointerEvents: adminSelection?.interactive ? 'none' : undefined }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {adminSelection?.interactive ? (
                <Box
                  {...getAdminPreviewFieldTargetProps('googleMapLocation')}
                  sx={{
                    ...getActivePreviewTargetStyle('googleMapLocation', adminSelection.activeFieldKey),
                    cursor: 'pointer',
                    inset: 0,
                    position: 'absolute'
                  }}
                />
              ) : null}
            </StyledMapWrapper>
          </StyledWhereToFindUsContent>
        </Container>
      </StyledWhereToFindUsSection>
    </>
  );
};

export default ContactView;
