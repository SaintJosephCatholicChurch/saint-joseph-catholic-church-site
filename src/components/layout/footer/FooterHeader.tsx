import Box from '@mui/material/Box';

interface FooterHeaderProps {
  text: string;
}

const FooterHeader = ({ text }: FooterHeaderProps) => {
  return (
    <Box
      component="h4"
      sx={{
        color: '#616169',
        fontSize: '25px',
        lineHeight: '27px',
        fontWeight: 300,
        textTransform: 'uppercase',
        mt: 0,
        mb: 1.5
      }}
    >
      {text}
    </Box>
  );
};

export default FooterHeader;
