import { SxProps, Theme } from '@mui/material';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';
import { MAX_APP_WIDTH } from '../../constants';

interface ContainerProps {
  children: ReactNode;
  disablePadding?: boolean;
  sx?: SxProps<Theme>;
}

const Container = ({ children, disablePadding = false, sx }: ContainerProps) => {
  return (
    <Box
      sx={{
        maxWidth: MAX_APP_WIDTH,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        boxSizing: 'border-box',
        p: !disablePadding ? '0 24px' : undefined,
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

export default Container;
