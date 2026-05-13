'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { StackProps } from '@mui/material/Stack';

interface AdminSupportPreviewSurfaceProps extends Omit<StackProps, 'children'> {
  children: ReactNode;
}

export function AdminSupportPreviewSurface({ children, sx, ...stackProps }: AdminSupportPreviewSurfaceProps) {
  return (
    <Stack
      spacing={1}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(127, 35, 44, 0.12)',
        borderRadius: '4px',
        width: '100%',
        ...sx
      }}
      {...stackProps}
    >
      {children}
    </Stack>
  );
}

interface AdminSupportPreviewInsetProps extends Omit<BoxProps, 'children'> {
  children?: ReactNode;
}

export function AdminSupportPreviewInset({ children, sx, ...boxProps }: AdminSupportPreviewInsetProps) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: '#f4efe7',
        border: '1px solid rgba(127, 35, 44, 0.12)',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden',
        ...sx
      }}
      {...boxProps}
    >
      {children}
    </Box>
  );
}

interface AdminResponsiveActionRowProps extends Omit<StackProps, 'children' | 'direction'> {
  children: ReactNode;
}

export function AdminResponsiveActionRow({ children, sx, ...stackProps }: AdminResponsiveActionRowProps) {
  return (
    <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.25} sx={{ width: '100%', ...sx }} {...stackProps}>
      {children}
    </Stack>
  );
}
