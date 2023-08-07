import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import type { Breakpoint } from '@mui/material/styles';

export function useMediaQueryDown(breakpoint: Breakpoint) {
  const theme = useTheme();

  return useMediaQuery(`${theme.breakpoints.down(breakpoint).replace("@media", "@container page")}`);
}

export function useMediaQueryUp(breakpoint: Breakpoint) {
  const theme = useTheme();

  return useMediaQuery(`${theme.breakpoints.up(breakpoint).replace("@media", "@container page")}`);
}
