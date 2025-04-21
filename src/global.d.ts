import type { Theme, SxProps } from '@mui/material/styles';

declare global {
  namespace React {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface HTMLAttributes<T> {
      sx?: SxProps<Theme>;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface SVGProps<T> {
      sx?: SxProps<Theme>;
    }
  }
}
