import CopyrightIcon from '@mui/icons-material/Copyright';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import format from 'date-fns/format';
import { useMemo } from 'react';
import churchDetails from '../../../lib/church_details';

const Copyright = () => {
  const theme = useTheme();
  const year = useMemo(() => format(new Date(), 'yyyy'), []);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,.1)',
        color: 'rgb(245, 244, 243)',
        backgroundColor: 'rgb(104, 11, 18)',
        boxSizing: 'border-box',
        lineHeight: '18px',
        gap: 1,
        [theme.breakpoints.down('md')]: {
          flexDirection: 'column',
          fontSize: '12px',
          pt: 1,
          pb: 1
        },
        [theme.breakpoints.up('md')]: {
          fontSize: '14px',
          height: '44px'
        }
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        <CopyrightIcon fontSize="small" />
        <Box>
          {year} {churchDetails.name}. All Rights Reserved.
        </Box>
      </Box>
      <Box
        sx={{
          color: '#988773',
          '&:hover': {
            color: 'rgb(245, 244, 243)',
            textDecoration: 'underline'
          }
        }}
        component="a"
        href="#"
      >
        Privacy Policy.
      </Box>
    </Box>
  );
};

export default Copyright;
