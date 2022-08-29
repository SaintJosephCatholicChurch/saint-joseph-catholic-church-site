import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { MAX_QUICK_LINK_HEIGHT, MAX_QUICK_LINK_WIDTH } from '../../../constants';
import quickLinks from '../../../lib/quick_links';

const QuickLinks = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        maxWidth: MAX_QUICK_LINK_WIDTH,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        [theme.breakpoints.down('md')]: {
          display: 'none'
        }
      }}
    >
      {quickLinks?.map((quickLink) => (
        <Box
          sx={{
            backgroundImage: `url(${quickLink.background})`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            width: '100%',
            height: MAX_QUICK_LINK_HEIGHT,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '20px 16px 32px',
            boxSizing: 'border-box',
            color: '#ffffff',
            transition: 'all .3s ease-in-out',
            '&:hover': {
              color: '#ffffff',
              cursor: 'pointer',
              '.quickLink-title': {
                mb: 2
              },
              '.quickLink-line': {
                width: '60%'
              }
            }
          }}
          component="a"
          key={`quickLink-${quickLink.url}`}
          href={quickLink.url}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'uppercase',
              fontSize: '14px',
              fontFamily: 'inherit',
              fontWeight: 500,
              mb: 2
            }}
          >
            <Box sx={{ background: '#680b12', p: '4px 8px', borderRadius: '3px', fontSpacing: '1px' }}>
              {quickLink.subtitle}
            </Box>
          </Box>
          <Box
            className="quickLink-title"
            sx={{
              transition: 'margin .3s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'uppercase',
              fontFamily: 'inherit',
              mb: 0
            }}
          >
            <Box
              component="h2"
              sx={{
                fontFamily: 'Oswald',
                fontWeight: 400,
                textShadow: '1px 1px 8px rgb(0 0 0)',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '4px 8px',
                fontSize: '30px',
                lineHeight: '30px',
                textAlign: 'center',
                m: 0
              }}
            >
              {quickLink.title}
            </Box>
          </Box>
          <Box
            className="quickLink-line"
            sx={{
              transition: 'width .3s ease-in-out',
              width: '0',
              height: '1px',
              margin: '0 auto',
              background: '#fff',
              overflow: 'hidden',
              display: 'block'
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default QuickLinks;
