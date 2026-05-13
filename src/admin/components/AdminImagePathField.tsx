'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import type { Ref } from 'react';

import { AdminResponsiveActionRow, AdminSupportPreviewInset, AdminSupportPreviewSurface } from './AdminSupport';

interface AdminImagePathFieldProps {
  actionButtonRef?: Ref<HTMLButtonElement>;
  buttonLabel?: string;
  disabled?: boolean;
  onButtonFocus?: () => void;
  onSelectImage: () => void;
  previewAlt?: string;
  previewHeight?: number;
  value: string;
}

export function AdminImagePathField({
  actionButtonRef,
  buttonLabel = 'Select image',
  disabled = false,
  onButtonFocus,
  onSelectImage,
  previewAlt,
  previewHeight = 180,
  value
}: AdminImagePathFieldProps) {
  const trimmedValue = value.trim();

  return (
    <Stack spacing={1.25} width="100%">
      {trimmedValue ? (
        <AdminSupportPreviewSurface sx={{ p: 0.25 }}>
          <AdminSupportPreviewInset sx={{ alignSelf: 'center', p: 0.25, width: '100%' }}>
            <Box
              component="img"
              src={trimmedValue}
              alt={previewAlt}
              sx={{
                display: 'block',
                maxHeight: previewHeight,
                maxWidth: '100%',
                objectFit: 'contain',
                width: '100%'
              }}
            />
          </AdminSupportPreviewInset>
        </AdminSupportPreviewSurface>
      ) : null}
      <AdminResponsiveActionRow>
        <Button
          onClick={onSelectImage}
          disabled={disabled}
          onFocus={onButtonFocus}
          ref={actionButtonRef}
          variant="outlined"
        >
          {buttonLabel}
        </Button>
        {trimmedValue ? (
          <Button color="inherit" href={trimmedValue} rel="noreferrer" target="_blank" variant="outlined">
            Open image
          </Button>
        ) : null}
      </AdminResponsiveActionRow>
    </Stack>
  );
}
