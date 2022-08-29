import Box from '@mui/material/Box';
import Head from 'next/head';
import useSmallScreen from '../util/smallScreen.util';
import Navigation from './navigation/Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
    </Box>
  );
}
