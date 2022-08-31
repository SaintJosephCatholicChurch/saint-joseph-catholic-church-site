import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { ReactNode } from 'react';
import Container from '../layout/Container';
import PageHeader from '../layout/header/PageHeader';
import Sidebar from '../layout/sidebar/Sidebar';

interface PageViewProps {
  title: string;
  children: ReactNode;
  showHeader: boolean;
}

const PageView = ({ title, children, showHeader }: PageViewProps) => {
  const theme = useTheme();

  return (
    <Box
      component="article"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}
    >
      {showHeader ? (
        <Box
          component="header"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <PageHeader title={title} />
        </Box>
      ) : null}
      <Container
        sx={{
          mt: !showHeader ? '98px' : undefined,
          [theme.breakpoints.down('md')]: {
            pt: 0
          },
          [theme.breakpoints.up('md')]: {
            pt: 6
          }
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gap: 8,
            width: '100%',
            gridTemplateColumns: '2fr 1fr',
            [theme.breakpoints.down('md')]: {
              gridTemplateColumns: '1fr'
            }
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'hidden'
            }}
          >
            {children}
          </Box>
          <Sidebar />
        </Box>
      </Container>
    </Box>
  );
};

export default PageView;
