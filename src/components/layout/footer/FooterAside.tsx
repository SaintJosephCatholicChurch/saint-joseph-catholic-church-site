import Box from '@mui/material/Box';
import FooterHeader from './FooterHeader';

interface FooterAsideProps {
  title: string;
  text: string;
}

const FooterAside = ({ title, text }: FooterAsideProps) => {
  return (
    <Box component="aside" sx={{ mb: 4 }}>
      <FooterHeader text={title} />
      <Box
        sx={{
          color: 'rgb(68, 68, 68)',
          fontSize: '16px',
          lineHeight: '24px',
          fontStyle: 'italic',
          fontWeight: 400,
          m: 0
        }}
      >
        {text}
      </Box>
    </Box>
  );
};

export default FooterAside;
