'use client';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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
        <Stack
          spacing={1}
          sx={{
            border: '1px solid rgba(127, 35, 44, 0.12)',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            p: 1.25
          }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: '#f4efe7',
                border: '1px solid rgba(127, 35, 44, 0.12)',
                borderRadius: '4px',
                color: '#7f232c',
                display: 'flex',
                flexShrink: 0,
                justifyContent: 'center',
                p: 1
              }}
            >
              <PictureAsPdfIcon fontSize="small" />
            </Box>
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
        </Stack>
      ) : null}
      <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.25}>
        <Button onClick={onSelectFile} disabled={disabled} variant="outlined">
          {buttonLabel}
        </Button>
        {trimmedValue ? (
          <Button color="inherit" href={trimmedValue} rel="noreferrer" target="_blank" variant="outlined">
            {openLabel}
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
