import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { ChurchDetails, StylesConfig } from '../../../interface';
import Container from '../Container';
import ContactDetails from './ContactDetails';
import Copyright from './Copyright';
import FooterAside from './FooterAside';
import FooterHeader from './FooterHeader';
import SearchBox from './SearchBox';

interface FooterProps {
  styles?: StylesConfig;
  churchDetails: ChurchDetails;
}

const Footer = ({ styles, churchDetails }: FooterProps) => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        mt: 4
      }}
    >
      <Box
        sx={{
          backgroundColor: '#e8e5e1',
          backgroundImage: styles ? `url(${styles.footer_background})` : undefined,
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center top',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pb: 1,
          [theme.breakpoints.down('md')]: {
            pt: 2,
          },
          [theme.breakpoints.up('md')]: {
            pt: 5,
          }
        }}
      >
        <Container
          sx={{
            display: 'grid',
            [theme.breakpoints.down('md')]: {
              gridTemplateColumns: '1fr',
              p: 3,
              gap: 2
            },
            [theme.breakpoints.up('md')]: {
              gridTemplateColumns: '2fr 1fr',
              gap: 6,
            }
          }}
        >
          <Box>
            <FooterAside title="Our Mission Statement" text={churchDetails.mission_statement} />
            <FooterAside title="Vision Statement" text={churchDetails.vision_statement} />
          </Box>
          <Box>
            <FooterHeader text="Search Our Site" />
            <SearchBox />
            <ContactDetails churchDetails={churchDetails} />
          </Box>
        </Container>
      </Box>
      <Copyright />
    </Box>
  );
};

export default Footer;
