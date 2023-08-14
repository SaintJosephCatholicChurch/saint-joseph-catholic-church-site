import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import getContainerQuery from '../../../util/container.util';
import transientOptions from '../../../util/transientOptions';
import useLocation from '../../../util/useLocation';
import SearchBox from '../../SearchBox';
import Container from '../Container';
import ContactDetails from './ContactDetails';
import Copyright from './Copyright';
import FooterAside from './FooterAside';
import FooterHeader from './FooterHeader';

import type { ChurchDetails, StylesConfig } from '../../../interface';

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

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      padding-top: 16px;
      padding-bottom: 24px;
    }

    ${getContainerQuery(theme.breakpoints.up('md'))} {
      padding-top: 40px;
    }
  `
);

const StyledFooterContents = styled('div')(
  ({ theme }) => `
    display: grid;

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      grid-template-columns: 1fr;
      p: 3,
      gap: 2
    }

    ${getContainerQuery(theme.breakpoints.up('md'))} {
      grid-template-columns: 2fr 1fr;
      gap: 48px;
    }
  `
);

interface FooterProps {
  styles?: StylesConfig;
  churchDetails: ChurchDetails;
  privacyPolicyLink: string;
  hideSearch?: boolean;
}

const Footer = ({ styles, churchDetails, privacyPolicyLink, hideSearch = false }: FooterProps) => {
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
              {!hideSearch ? <SearchBox value={query} /> : <div />}
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
