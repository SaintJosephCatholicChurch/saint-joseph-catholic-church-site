import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import Navigation from './navigation/Navigation';
import ScrollTop from './navigation/ScrollTop';

const StyledLayout = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;

    ${theme.breakpoints.down('lg')} {
      flex: 1 0 auto;
    }
  `
);

const StyledMain = styled('main')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;

    ${theme.breakpoints.down('lg')} {
      flex: 1 0 auto;
    }
  `
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <StyledLayout>
        <Head>
          <meta charSet="utf-8" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
          />
          <meta name="theme-color" content="#bc2f3b" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="description" content="Saint Joseph Catholic Church" />
        </Head>
        <div id="back-to-top-anchor" />
        <Navigation />
        <StyledMain>{children}</StyledMain>
        <ScrollTop>
          <Fab size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </StyledLayout>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        html,
        body {
          min-height: 100vh;
        }
      `}</style>
    </>
  );
};

export default Layout;
