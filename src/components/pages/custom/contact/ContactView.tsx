'use client';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import { styled } from '@mui/material/styles';

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
  background: linear-gradient(183.55deg, #f1f1f1 3%, rgba(241, 241, 241, 0) 30%),
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

interface ContactViewProps {
  churchDetails: ChurchDetails;
  disableForm?: boolean;
}

const ContactView = ({ churchDetails, disableForm }: ContactViewProps) => {
  return (
    <>
      <StyledContactSection key="contact-section">
        <Container>
          <StyledContactContentWrapper>
            <PageTitle title="Contact" />
            <StyledContactContent>
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
                <StyledChurchDetailSection>
                  <StyledChurchDetailTitle>Church Phone</StyledChurchDetailTitle>
                  <StyledChurchDetailsLink href={`tel:${churchDetails.phone}`}>
                    <PhoneEnabledIcon fontSize="small" />
                    {churchDetails.phone}
                  </StyledChurchDetailsLink>
                  {churchDetails.additional_phones?.map((phone, index) => (
                    <>
                      <StyledChurchDetailTitle key={`additional-phone-${index}-title`}>
                        {phone.name}:
                      </StyledChurchDetailTitle>
                      <StyledChurchDetailsLink key={`additional-phone-${index}-link`} href={`tel:${phone.phone}`}>
                        <PhoneEnabledIcon fontSize="small" />
                        {phone.phone}
                      </StyledChurchDetailsLink>
                    </>
                  ))}
                  <StyledChurchDetailTitle>Church Email</StyledChurchDetailTitle>
                  <StyledChurchDetailsLink href={`mailto:${churchDetails.email}`} target="_blank" rel="noreferrer">
                    <EmailIcon fontSize="small" />
                    {churchDetails.email}
                  </StyledChurchDetailsLink>
                  {churchDetails.additional_emails?.map((email, index) => (
                    <>
                      <StyledChurchDetailTitle key={`additional-email-${index}-title`}>
                        {email.name}
                      </StyledChurchDetailTitle>
                      <StyledChurchDetailsLink key={`additional-email-${index}-link`} href={`mailto:${email.email}`}>
                        <EmailIcon fontSize="small" />
                        {email.email}
                      </StyledChurchDetailsLink>
                    </>
                  ))}
                </StyledChurchDetailSection>
                <StyledChurchDetailSection>
                  {churchDetails.contacts?.map((contact, index) => (
                    <>
                      <StyledChurchDetailTitle key={`contact-${index}-title`}>{contact.title}</StyledChurchDetailTitle>
                      <StyledChurchDetailContent key={`contact-${index}-link`}>
                        {contact.name}
                      </StyledChurchDetailContent>
                    </>
                  ))}
                </StyledChurchDetailSection>
                <StyledSocialLinks>
                  <StyledChurchDetailsLink
                    href={`https://www.facebook.com/${churchDetails.facebook_page}`}
                    target="_blank"
                    rel="noreferrer"
                    title={`Facebook - ${churchDetails.facebook_page}`}
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
            <StyledMap
              src={churchDetails.google_map_location}
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </StyledWhereToFindUsContent>
        </Container>
      </StyledWhereToFindUsSection>
    </>
  );
};

export default ContactView;
