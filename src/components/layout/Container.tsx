import { SxProps, Theme } from '@mui/material';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';
import { MAX_APP_WIDTH } from '../../constants';

interface ContainerProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const Container = ({ children, sx }: ContainerProps) => {
  return (
    <Box
      sx={{
        maxWidth: MAX_APP_WIDTH,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        pl: 3,
        pr: 3,
        boxSizing: 'border-box',
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

export default Container;
