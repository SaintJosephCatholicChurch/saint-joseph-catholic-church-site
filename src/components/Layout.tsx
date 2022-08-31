import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Head from 'next/head';
import useSmallScreen from '../util/smallScreen.util';
import Navigation from './navigation/Navigation';
import ScrollTop from './navigation/ScrollTop';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isSmallScreen = useSmallScreen();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: isSmallScreen ? '1 0 auto' : undefined,
        boxSizing: 'border-box',
        height: '100%'
      }}
    >
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#fff" />
      </Head>
      <Box id="back-to-top-anchor" />
      <Navigation />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100%',
          flex: isSmallScreen ? '1 0 auto' : undefined
        }}
      >
        {children}
      </Box>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </Box>
  );
};

export default Layout;
