'use client';

import Box from '@mui/material/Box';

import { AdminSurfacePanel } from './components/AdminCards';

import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

interface AdminPagePreviewFrameProps {
  children: ReactNode;
  pageSx?: SxProps<Theme>;
}

export function AdminPagePreviewFrame({ children, pageSx }: AdminPagePreviewFrameProps) {
  return (
    <AdminSurfacePanel
      tone="plain"
      sx={{
        alignItems: 'stretch',
        background: 'rgba(255, 255, 255, 0.92)',
        borderRadius: '4px',
        color: '#222',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'stretch',
        margin: '0 auto',
        minHeight: 0,
        minWidth: 0,
        overflow: 'hidden',
        p: '4px',
        width: '100%'
      }}
    >
      <Box
        sx={{
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflowX: 'hidden',
          overflowY: 'auto',
          px: { md: 3, sm: 3, xs: 1.5 },
          width: '100%'
        }}
      >
        <Box
          sx={{
            boxSizing: 'border-box',
            container: 'page / inline-size',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            maxWidth: '100%',
            minHeight: '100%',
            minWidth: 0,
            width: '100%',
            ...pageSx
          }}
        >
          {children}
        </Box>
      </Box>
    </AdminSurfacePanel>
  );
}
