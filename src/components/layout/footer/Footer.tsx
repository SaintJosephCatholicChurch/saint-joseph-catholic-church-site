import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import type { ChurchDetails, StylesConfig } from '../../../interface';
import transientOptions from '../../../util/transientOptions';
import useLocation from '../../../util/useLocation';
import SearchBox from '../../SearchBox';
import Container from '../Container';
import ContactDetails from './ContactDetails';
import Copyright from './Copyright';
import FooterAside from './FooterAside';
import FooterHeader from './FooterHeader';

interface StyledFooterContainerWrapperProps {
  $footerBackground?: string;
}

const StyledFooterContainerWrapper = styled(
  'div',
  transientOptions
)<StyledFooterContainerWrapperProps>(
  ({ theme, $footerBackground }) => `
    background-color: #e8e5e1;
    ${$footerBackground ? `background-image: url(${$footerBackground});` : ''}
    background-repeat: repeat;
    background-position: center top;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 8px;

    ${theme.breakpoints.down('md')} {
      padding-top: 16px;
      padding-bottom: 24px;
    }

    ${theme.breakpoints.up('md')} {
      padding-top: 40px;
    }
  `
);

const StyledFooterContents = styled('div')(
  ({ theme }) => `
    display: grid;

    ${theme.breakpoints.down('md')} {
      grid-template-columns: 1fr;
      p: 3,
      gap: 2
    }

    ${theme.breakpoints.up('md')} {
      grid-template-columns: 2fr 1fr;
      gap: 48px;
    }
  `
);

interface FooterProps {
  styles?: StylesConfig;
  churchDetails: ChurchDetails;
  privacyPolicyLink: string;
}

const Footer = ({ styles, churchDetails, privacyPolicyLink }: FooterProps) => {
  const { search } = useLocation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(search);
    setQuery(params.get('q'));
  }, [search]);
  
  return (
    <footer>
      <StyledFooterContainerWrapper $footerBackground={styles?.footer_background}>
        <Container>
          <StyledFooterContents>
            <Box>
              <FooterAside title="Our Mission Statement" text={churchDetails.mission_statement} />
              <FooterAside title="Vision Statement" text={churchDetails.vision_statement} />
            </Box>
            <Box>
              <FooterHeader text="Search Our Site" />
              <SearchBox value={query} />
              <ContactDetails churchDetails={churchDetails} />
            </Box>
          </StyledFooterContents>
        </Container>
      </StyledFooterContainerWrapper>
      <Copyright privacyPolicyLink={privacyPolicyLink} />
    </footer>
  );
};

export default Footer;
