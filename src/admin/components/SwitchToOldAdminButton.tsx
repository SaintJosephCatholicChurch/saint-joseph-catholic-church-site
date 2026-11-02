'use client';

import Button from '@mui/material/Button';

import { LEGACY_ADMIN_PATH } from '../adminConfig';

export default function SwitchToOldAdminButton({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <Button
      variant="outlined"
      color="inherit"
      href={LEGACY_ADMIN_PATH}
      fullWidth={fullWidth}
      sx={{
        flexShrink: 0,
        minWidth: { sm: 'auto', xs: 0 },
        px: { sm: 2, xs: 1 },
        '& .full-label': { display: { sm: 'inline', xs: 'none' } },
        '& .short-label': { display: { sm: 'none', xs: 'inline' } }
      }}
    >
      <span className="full-label">Switch to old admin</span>
      <span className="short-label">Old admin</span>
    </Button>
  );
}
