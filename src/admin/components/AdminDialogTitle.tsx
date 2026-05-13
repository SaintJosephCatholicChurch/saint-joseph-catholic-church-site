'use client';

import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';

import type { ReactNode } from 'react';

interface AdminDialogTitleProps {
  actions?: ReactNode;
  children: ReactNode;
  onClose?: () => void;
}

export function AdminDialogTitle({ actions, children, onClose }: AdminDialogTitleProps) {
  return (
    <DialogTitle
      sx={{
        alignItems: 'center',
        display: 'flex',
        gap: 1.5,
        pr: onClose ? 7 : 3,
        py: 1.75
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
      {actions ? <Box sx={{ flexShrink: 0, mr: onClose ? 4.5 : 0 }}>{actions}</Box> : null}
      {onClose ? (
        <IconButton
          aria-label="Close dialog"
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', right: 16, top: 16 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
