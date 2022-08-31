import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import styles from '../../../lib/styles';
import ChurchDetailsHeader from './ChurchDetailsHeader';

interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${styles.header_background})`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center top',
          [theme.breakpoints.down('md')]: {
            padding: '98px 0 40px'
          },
          [theme.breakpoints.up('md')]: {
            padding: '130px 0 40px'
          },
          width: '100%'
        }}
      >
        <Box
          component="h1"
          sx={{
            color: styles.header_color,
            fontStyle: styles.header_font_style,
            textAlign: 'center',
            margin: 0,
            [theme.breakpoints.down('md')]: {
              fontSize: '30px',
              lineHeight: '30px',
              pl: 3,
              pr: 3
            },
            [theme.breakpoints.up('md')]: {
              fontSize: '50px',
              lineHeight: '50px'
            },
            fontWeight: 400
          }}
        >
          {title}
        </Box>
      </Box>
      <ChurchDetailsHeader />
    </>
  );
};

export default PageHeader;
