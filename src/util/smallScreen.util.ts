import useMediaQuery from '@mui/material/useMediaQuery';

export default function useSmallScreen(size = 769) {
  return useMediaQuery(`(max-width:${size}px)`);
}
