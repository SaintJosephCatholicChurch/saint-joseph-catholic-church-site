'use client';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AdminResponsiveActionRow, AdminSupportPreviewInset, AdminSupportPreviewSurface } from './AdminSupport';

interface AdminFilePathFieldProps {
  buttonLabel?: string;
  disabled?: boolean;
  onSelectFile: () => void;
  openLabel?: string;
  value: string;
}

export function AdminFilePathField({
  buttonLabel = 'Select file',
  disabled = false,
  onSelectFile,
  openLabel = 'Open file',
  value
}: AdminFilePathFieldProps) {
  const trimmedValue = value.trim();
  const fileName = trimmedValue ? trimmedValue.split('/').pop() || trimmedValue : '';

  return (
    <Stack spacing={1.25} width="100%">
      {trimmedValue ? (
        <AdminSupportPreviewSurface sx={{ p: 1.25 }}>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
            <AdminSupportPreviewInset
              sx={{
                color: '#7f232c',
                flexShrink: 0,
                p: 1
              }}
            >
              <PictureAsPdfIcon fontSize="small" />
            </AdminSupportPreviewInset>
            <Stack spacing={0.25} sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {fileName}
              </Typography>
              <Typography
                sx={{
                  color: '#6a5448',
                  fontSize: '0.82rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {trimmedValue}
              </Typography>
            </Stack>
          </Stack>
        </AdminSupportPreviewSurface>
      ) : null}
      <AdminResponsiveActionRow>
        <Button onClick={onSelectFile} disabled={disabled} variant="outlined">
          {buttonLabel}
        </Button>
        {trimmedValue ? (
          <Button color="inherit" href={trimmedValue} rel="noreferrer" target="_blank" variant="outlined">
            {openLabel}
          </Button>
        ) : null}
      </AdminResponsiveActionRow>
    </Stack>
  );
}
