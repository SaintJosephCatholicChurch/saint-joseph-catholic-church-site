import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useCallback, useMemo, useState } from 'react';
import Container from '../components/layout/Container';
import { StyledChurchDetailsLink, StyledContactDetails } from '../components/layout/footer/ContactDetails';
import PageLayout from '../components/PageLayout';
import ContactForm from '../components/pages/custom/contact/ContactForm';
import PageTitle from '../components/pages/PageTitle';
import churchDetails from '../lib/church_details';
import homePageData from '../lib/homepage';
import { isNotEmpty } from '../util/string.util';

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
    justify-content: center;
    justify-self: center;
    width: 100%;
    gap: 40px;

    ${theme.breakpoints.down('md')} {
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

    ${theme.breakpoints.down('lg')} {
      height: 500px;
    }

    ${theme.breakpoints.down('md')} {
      height: 400px;
    }

    ${theme.breakpoints.down('sm')} {
      height: 200px;
    }
  `
);

const StyledChurchDetailSection = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
    margin-bottom: 16px;

    ${theme.breakpoints.down('md')} {
      gap: 24px;
    }
`
);

const StyledChurchDetail = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    gap: 8px;

    ${theme.breakpoints.down('md')} {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  `
);

const StyledChurchDetailTitle = styled('div')`
  font-weight: 700;
`;

const StyledChurchDetailContent = styled('div')``;

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

interface ContactBody {
  name: string;
  subject: string;
  comment: string;
}

const Contact = () => {
  const [contactFormData, setContactFormData] = useState<Partial<ContactBody>>({ subject: 'Comment / Question' });
  const [body, valid] = useMemo(() => {
    if (isNotEmpty(contactFormData.name) && isNotEmpty(contactFormData.comment)) {
      return [
        `Full Name: ${contactFormData.name}

Comments / Questions: ${contactFormData.comment}`,
        true
      ];
    }

    return ['', false];
  }, [contactFormData.comment, contactFormData.name]);

  const onChange = useCallback(
    (data: Partial<ContactBody>) => {
      setContactFormData({ ...contactFormData, ...data });
    },
    [contactFormData]
  );

  return (
    <PageLayout url="/mass-confession-times" title="Contact" hideSidebar hideHeader fullWidth disableBottomMargin>
      <StyledContactSection>
        <Container>
          <StyledContactContentWrapper>
            <PageTitle title="Contact" />
            <StyledContactContent>
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
                <StyledChurchDetailSection>
                  <StyledChurchDetail>
                    <StyledChurchDetailTitle>Church Phone</StyledChurchDetailTitle>
                    <StyledChurchDetailsLink href={`tel:${churchDetails.phone}`}>
                      <PhoneEnabledIcon fontSize="small" />
                      {churchDetails.phone}
                    </StyledChurchDetailsLink>
                  </StyledChurchDetail>
                  {churchDetails.additional_phones?.map((phone, index) => (
                    <StyledChurchDetail key={`additional-phone-${index}`}>
                      <StyledChurchDetailTitle>{phone.name}:</StyledChurchDetailTitle>
                      <StyledChurchDetailsLink href={`tel:${phone.phone}`}>
                        <PhoneEnabledIcon fontSize="small" />
                        {phone.phone}
                      </StyledChurchDetailsLink>
                    </StyledChurchDetail>
                  ))}
                  <StyledChurchDetail>
                    <StyledChurchDetailTitle>Church Email</StyledChurchDetailTitle>
                    <StyledChurchDetailsLink href={`mailto:${churchDetails.email}`} target="_blank" rel="noreferrer">
                      <EmailIcon fontSize="small" />
                      {churchDetails.email}
                    </StyledChurchDetailsLink>
                  </StyledChurchDetail>
                  {churchDetails.additional_emails?.map((email, index) => (
                    <StyledChurchDetail key={`additional-email-${index}`}>
                      <StyledChurchDetailTitle>{email.name}</StyledChurchDetailTitle>
                      <StyledChurchDetailsLink href={`mailto:${email.email}`}>
                        <EmailIcon fontSize="small" />
                        {email.email}
                      </StyledChurchDetailsLink>
                    </StyledChurchDetail>
                  ))}
                </StyledChurchDetailSection>
                <StyledChurchDetailSection>
                  {churchDetails.contacts?.map((contact, index) => (
                    <StyledChurchDetail key={`contact-${index}`}>
                      <StyledChurchDetailTitle>{contact.title}</StyledChurchDetailTitle>
                      <StyledChurchDetailContent>{contact.name}</StyledChurchDetailContent>
                    </StyledChurchDetail>
                  ))}
                </StyledChurchDetailSection>
                <StyledSocialLinks>
                  <StyledChurchDetailsLink
                    href={`https://www.facebook.com/${churchDetails.facebook_page}`}
                    target="_blank"
                    rel="noreferrer"
                    title={`Facebook - ${churchDetails.facebook_page}`}
                  >
                    <FacebookIcon fontSize="small" />
                  </StyledChurchDetailsLink>
                </StyledSocialLinks>
              </StyledContactDetails>
              <ContactForm />
            </StyledContactContent>
          </StyledContactContentWrapper>
        </Container>
      </StyledContactSection>
      <StyledWhereToFindUsSection>
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
    </PageLayout>
  );
};

export default Contact;
