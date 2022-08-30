import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { ReactNode } from 'react';
import contentStyles from '../../../public/styles/content.module.css';
import { getTag } from '../../lib/tags';
import Container from '../layout/Container';
import PageHeader from '../layout/header/PageHeader';
import QuickLinks from '../layout/sidebar/QuickLinks';
import TagButton from '../TagButton';

interface PageViewProps {
  title: string;
  tags?: string[];
  children: ReactNode;
}

const PageView = ({ title, tags = [], children }: PageViewProps) => {
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
      <Box
        component="header"
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}
      >
        <PageHeader title={title} />
      </Box>
      <Container
        sx={{
          [theme.breakpoints.down('md')]: {
            pt: 0
          },
          [theme.breakpoints.up('md')]: {
            pt: 6
          }
        }}
      >
        <Box sx={{ display: 'flex', gap: 4, width: '100%' }}>
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'hidden',
              [theme.breakpoints.down('md')]: {
                p: 3
              }
            }}
          >
            <div className={`content ${contentStyles.content}`}>{children}</div>
            {tags.length ? (
              <ul>
                {tags.map((it, i) => (
                  <li key={i}>
                    <TagButton tag={getTag(it)} />
                  </li>
                ))}
              </ul>
            ) : null}
          </Box>
          <QuickLinks />
        </Box>
      </Container>
    </Box>
  );
};

export default PageView;
