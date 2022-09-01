import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fab from '@mui/material/Fab';
import Head from 'next/head';
import useSmallScreen from '../util/smallScreen.util';
import styled from '../util/styled.util';
import Navigation from './navigation/Navigation';
import ScrollTop from './navigation/ScrollTop';

interface StyledLayoutProps {
  isSmallScreen: boolean;
}

const StyledLayout = styled('div', ['isSmallScreen'])<StyledLayoutProps>(
  ({ isSmallScreen }) => `
    display: flex;
    flex-direction: column;
    ${isSmallScreen ? 'flex: 1 0 auto;' : ''}
    box-sizing: border-box;
    height: 100%;
  `
);

interface StyledMainProps {
  isSmallScreen: boolean;
}

const StyledMain = styled('main', ['isSmallScreen'])<StyledMainProps>(
  ({ isSmallScreen }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100%;
    ${isSmallScreen ? 'flex: 1 0 auto;' : ''}
  `
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isSmallScreen = useSmallScreen();

  return (
    <StyledLayout isSmallScreen={isSmallScreen}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#fff" />
      </Head>
      <div id="back-to-top-anchor" />
      <Navigation />
      <StyledMain isSmallScreen={isSmallScreen}>{children}</StyledMain>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </StyledLayout>
  );
};

export default Layout;
