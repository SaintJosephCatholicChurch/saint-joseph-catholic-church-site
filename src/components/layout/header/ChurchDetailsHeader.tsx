import EmailIcon from '@mui/icons-material/Email';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import churchDetails from '../../../lib/church_details';

const ChurchDetailsHeaderLink = styled('a')`
  display: flex;
  align-items: center;
  color: white;
  gap: 4px;

  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const CenteredBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChurchDetailsHeader = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        background: 'black',
        color: 'white',
        fontFamily: 'Lato',
        fontSize: '17px',
        lineHeight: '34px',
        width: '100%',
        borderTop: '1px solid rgb(225, 209, 169)',
        [theme.breakpoints.down('md')]: {
          display: 'none'
        },
        [theme.breakpoints.up('md')]: {
          gap: 0.5
        }
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          [theme.breakpoints.down('md')]: {
            display: 'none'
          }
        }}
      />
      <CenteredBox>{churchDetails.name}</CenteredBox>
      <Box
        sx={{
          [theme.breakpoints.down('md')]: {
            display: 'none'
          }
        }}
      >
        |
      </Box>
      <CenteredBox>
        <ChurchDetailsHeaderLink
          href={`http://maps.google.com/maps?q=${encodeURIComponent(churchDetails.address)}`}
          target="_blank"
          rel="noreferrer"
        >
          <CenteredBox>
            {churchDetails.address} - {churchDetails.city}, {churchDetails.state} {churchDetails.zipcode}
          </CenteredBox>
        </ChurchDetailsHeaderLink>
      </CenteredBox>
      <Box
        sx={{
          [theme.breakpoints.down('md')]: {
            display: 'none'
          }
        }}
      >
        |
      </Box>
      <CenteredBox>
        <ChurchDetailsHeaderLink href={`tel:${churchDetails.phone}`}>
          <PhoneEnabledIcon fontSize="small" />
          {churchDetails.phone}
        </ChurchDetailsHeaderLink>
      </CenteredBox>
      <Box
        sx={{
          [theme.breakpoints.down('md')]: {
            display: 'none'
          }
        }}
      >
        |
      </Box>
      <CenteredBox>
        <ChurchDetailsHeaderLink href={`mailto:${churchDetails.email}`} target="_blank" rel="noreferrer">
          <EmailIcon fontSize="small" />
          {churchDetails.email}
        </ChurchDetailsHeaderLink>
      </CenteredBox>
      <Box
        sx={{
          flexGrow: 1,
          [theme.breakpoints.down('md')]: {
            display: 'none'
          }
        }}
      />
    </Box>
  );
};

export default ChurchDetailsHeader;
