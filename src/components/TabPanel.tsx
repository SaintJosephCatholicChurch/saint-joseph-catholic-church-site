/* eslint-disable react/display-name */
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import { memo, ReactNode, Ref, useEffect, useRef, useState } from 'react';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
  sx?: SxProps<Theme>;
}

const TabPanel = memo(({ children, value, index, sx, ...other }: TabPanelProps) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        visibility: value !== index ? 'hidden' : undefined,
        ...sx
      }}
    >
      {value === index ? children : null}
    </Box>
  );
});

export default TabPanel;
