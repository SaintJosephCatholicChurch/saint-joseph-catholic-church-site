import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';

import getContainerQuery from '../../../util/container.util';
import transientOptions from '../../../util/transientOptions';
import useLocation from '../../../util/useLocation';
import useWindowSize from '../../../util/useWindowSize';
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
      padding-top: 32px;
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
    padding-bottom: 24px;

    ${getContainerQuery(theme.breakpoints.down('lg'))} {
      grid-template-columns: 1fr;
      p: 3,
      gap: 2
    }

    ${getContainerQuery(theme.breakpoints.up('lg'))} {
      grid-template-columns: 2fr 1fr;
      gap: 48px;
    }
  `
);

const StyledFacebookFeedWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const MAX_FACEBOOK_WIDGET_WIDTH = 500;
const MAX_FACEBOOK_WIDGET_WIDTH_PADDING = 48;

interface FooterProps {
  styles?: StylesConfig;
  churchDetails: ChurchDetails;
  privacyPolicyLink: string;
  hideSearch?: boolean;
}

const Footer = ({ styles, churchDetails, privacyPolicyLink, hideSearch = false }: FooterProps) => {
  const { search } = useLocation();
  const [query, setQuery] = useState('');

  const { width } = useWindowSize();

  const facebookWidgetWidth = useMemo(
    () =>
      !width || width >= MAX_FACEBOOK_WIDGET_WIDTH
        ? MAX_FACEBOOK_WIDGET_WIDTH - MAX_FACEBOOK_WIDGET_WIDTH_PADDING
        : width - MAX_FACEBOOK_WIDGET_WIDTH_PADDING,
    [width]
  );

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
              <Box>
                <FooterHeader text="Search Our Site" />
                {!hideSearch ? <SearchBox value={query} /> : <div />}
                <ContactDetails churchDetails={churchDetails} />
              </Box>
            </Box>
            <Box>
              <StyledFacebookFeedWrapper>
                <iframe
                  src={`https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fstjosephchurchbluffton%2F&tabs=timeline&width=${facebookWidgetWidth}&height=600&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
                  width={facebookWidgetWidth}
                  height="600"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                ></iframe>
              </StyledFacebookFeedWrapper>
            </Box>
          </StyledFooterContents>
        </Container>
      </StyledFooterContainerWrapper>
      <Copyright privacyPolicyLink={privacyPolicyLink} />
    </footer>
  );
};

export default Footer;
