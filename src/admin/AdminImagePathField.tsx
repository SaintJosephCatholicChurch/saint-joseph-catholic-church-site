'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

interface AdminImagePathFieldProps {
  buttonLabel?: string;
  disabled?: boolean;
  onSelectImage: () => void;
  previewAlt?: string;
  previewHeight?: number;
  value: string;
}

export function AdminImagePathField({
  buttonLabel = 'Select image',
  disabled = false,
  onSelectImage,
  previewAlt,
  previewHeight = 180,
  value
}: AdminImagePathFieldProps) {
  const trimmedValue = value.trim();

  return (
    <Stack spacing={1.25} width="100%">
      {trimmedValue ? (
        <Stack
          spacing={1}
          sx={{
            border: '1px solid rgba(127, 35, 44, 0.12)',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            p: 0.25
          }}
        >
          <Box
            component="img"
            src={trimmedValue}
            alt={previewAlt}
            sx={{
              alignSelf: 'center',
              border: '1px solid rgba(127, 35, 44, 0.12)',
              borderRadius: '4px',
              display: 'block',
              maxHeight: previewHeight,
              maxWidth: '100%',
              objectFit: 'contain',
              backgroundColor: '#f4efe7'
            }}
          />
        </Stack>
      ) : null}
      <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.25}>
        <Button onClick={onSelectImage} disabled={disabled} variant="outlined">
          {buttonLabel}
        </Button>
        {trimmedValue ? (
          <Button color="inherit" href={trimmedValue} rel="noreferrer" target="_blank" variant="outlined">
            Open image
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
