import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import type { Breakpoint } from '@mui/material/styles';

export function useMediaQueryDown(breakpoint: Breakpoint) {
  const theme = useTheme();

  return useMediaQuery(theme.breakpoints.down(breakpoint));
}

export function useMediaQueryUp(breakpoint: Breakpoint) {
  const theme = useTheme();

  return useMediaQuery(theme.breakpoints.up(breakpoint));
}
