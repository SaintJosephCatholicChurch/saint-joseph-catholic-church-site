import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fab from '@mui/material/Fab';
import Head from 'next/head';
import styled from '../util/styled.util';
import Navigation from './navigation/Navigation';
import ScrollTop from './navigation/ScrollTop';

const StyledLayout = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    min-height: 100vh;

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
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="apple-touch-icon" href="/icon.png" />
          <meta name="theme-color" content="#fff" />
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
