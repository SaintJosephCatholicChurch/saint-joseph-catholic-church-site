'use client';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';
import Head from 'next/head';

import churchDetails from '../lib/church_details';
import menuDetails from '../lib/menu';
import getContainerQuery from '../util/container.util';
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

    ${getContainerQuery(theme.breakpoints.down('lg'))} {
      flex: 1 0 auto;
    }
  `
);

const StyledMain = styled('main')(
  ({ theme }) => `
    container: page / inline-size;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;

    ${getContainerQuery(theme.breakpoints.down('lg'))} {
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
      <StyledLayout id="drawer-container">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />
          <meta name="theme-color" content="#bc2f3b" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="description" content={churchDetails.name} />
        </Head>
        <div id="back-to-top-anchor" />
        <Navigation churchDetails={churchDetails} menuDetails={menuDetails} />
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
