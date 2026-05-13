'use client';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { AdminSurfacePanel } from './AdminCards';

import type { BoxProps } from '@mui/material/Box';
import type { StackProps } from '@mui/material/Stack';
import type { ReactNode, SyntheticEvent } from 'react';

interface AdminStatusStackProps {
  children?: ReactNode;
  errorMessage?: string | null;
  loading?: boolean;
  successMessage?: string | null;
}

export function AdminStatusStack({ children, errorMessage, loading = false, successMessage }: AdminStatusStackProps) {
  const [isSuccessOpen, setIsSuccessOpen] = useState(Boolean(successMessage));
  const hasChildren = Boolean(children);
  const hasStackContent = hasChildren || Boolean(errorMessage) || loading;

  useEffect(() => {
    if (successMessage) {
      setIsSuccessOpen(true);
    }
  }, [successMessage]);

  function handleSuccessClose(_event?: Event | SyntheticEvent, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }

    setIsSuccessOpen(false);
  }

  if (!hasStackContent && !(successMessage && isSuccessOpen)) {
    return null;
  }

  return (
    <>
      {hasStackContent ? (
        <Stack spacing={2}>
          {children}
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          {loading ? <LinearProgress /> : null}
        </Stack>
      ) : null}
      <Snackbar
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        autoHideDuration={4000}
        onClose={handleSuccessClose}
        open={Boolean(successMessage) && isSuccessOpen}
      >
        <Alert onClose={handleSuccessClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

interface AdminCompactActionBarProps {
  actions: ReactNode;
  backLabel?: string;
  onBack?: () => void;
}

export function AdminCompactActionBar({ actions, backLabel = 'Back', onBack }: AdminCompactActionBarProps) {
  return (
    <Stack
      direction={{ sm: 'row', xs: 'column' }}
      spacing={1.5}
      justifyContent={onBack ? 'space-between' : 'flex-end'}
      alignItems={{ sm: 'center', xs: 'stretch' }}
    >
      {onBack ? (
        <Button onClick={onBack} variant="outlined" color="inherit" startIcon={<ChevronLeftIcon />}>
          {backLabel}
        </Button>
      ) : null}
      {actions}
    </Stack>
  );
}

interface AdminDetailTabOption {
  label: ReactNode;
  value: string;
}

interface AdminDetailTabsProps {
  onChange: (value: string) => void;
  tabs: readonly AdminDetailTabOption[];
  value: string;
}

export function AdminDetailTabs({ onChange, tabs, value }: AdminDetailTabsProps) {
  return (
    <Tabs
      value={value}
      onChange={(_, nextValue: string) => onChange(nextValue)}
      variant="fullWidth"
      sx={{
        backgroundColor: 'rgba(255,255,255,0.72)',
        border: '1px solid rgba(127, 35, 44, 0.12)',
        borderRadius: '4px',
        minHeight: 0
      }}
    >
      {tabs.map((tab) => (
        <Tab key={tab.value} label={tab.label} value={tab.value} />
      ))}
    </Tabs>
  );
}

interface AdminPreviewPaneProps extends Omit<StackProps, 'children'> {
  children: ReactNode;
}

export function AdminPreviewPane({ children, sx, ...stackProps }: AdminPreviewPaneProps) {
  return (
    <Stack
      spacing={1.5}
      sx={{
        flex: 1,
        height: '100%',
        minHeight: 0,
        minWidth: 0,
        overflow: 'hidden',
        width: '100%',
        ...sx
      }}
      {...stackProps}
    >
      {children}
    </Stack>
  );
}

interface AdminRecordHeaderProps {
  actions?: ReactNode;
  title: ReactNode;
}

export function AdminRecordHeader({ actions, title }: AdminRecordHeaderProps) {
  return (
    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ minWidth: 0 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {title}
        </Typography>
      </Box>
      {actions ? <Box sx={{ display: 'flex', flexShrink: 0, alignItems: 'center' }}>{actions}</Box> : null}
    </Stack>
  );
}

interface AdminListSidebarProps extends Omit<StackProps, 'children'> {
  actions?: ReactNode;
  children?: ReactNode;
  emptyState?: ReactNode;
  filter?: ReactNode;
  summaryLabel?: ReactNode;
  summaryValue?: ReactNode;
}

export function AdminListSidebar({
  actions,
  children,
  emptyState,
  filter,
  summaryLabel,
  summaryValue,
  sx,
  ...stackProps
}: AdminListSidebarProps) {
  const hasHeader = Boolean(actions) || Boolean(filter) || Boolean(summaryLabel) || Boolean(summaryValue);

  return (
    <AdminSurfacePanel
      tone="sidebar"
      spacing={1.5}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        minHeight: 0,
        overflow: 'hidden',
        p: 2,
        ...sx
      }}
      {...stackProps}
    >
      {actions}
      {filter}
      {summaryLabel || summaryValue ? (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{ color: '#9b9b9b', fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            {summaryLabel}
          </Typography>
          <Typography sx={{ color: '#616169', fontSize: '0.9rem' }}>{summaryValue}</Typography>
        </Stack>
      ) : null}
      {hasHeader ? <Divider /> : null}
      {emptyState}
      {children}
    </AdminSurfacePanel>
  );
}

interface AdminSidebarListBodyProps extends Omit<BoxProps, 'children'> {
  children?: ReactNode;
  dense?: boolean;
}

export function AdminSidebarListBody({ children, dense = false, sx, ...boxProps }: AdminSidebarListBodyProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        gap: dense ? 1 : 1.5,
        minHeight: 0,
        overflowY: 'auto',
        paddingTop: 0.25,
        ...sx
      }}
      {...boxProps}
    >
      {children}
    </Box>
  );
}

interface AdminRecordWorkspacePanelProps {
  children: ReactNode;
  contentSx?: BoxProps['sx'];
  panelSx?: StackProps['sx'];
}

export function AdminRecordWorkspacePanel({ children, contentSx, panelSx }: AdminRecordWorkspacePanelProps) {
  return (
    <AdminSurfacePanel
      spacing={2}
      sx={{
        display: 'flex',
        minHeight: 0,
        overflow: 'hidden',
        ...panelSx
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          minHeight: 0,
          overflowY: 'auto',
          p: { md: 2.5, xs: 2 },
          ...contentSx
        }}
      >
        {children}
      </Box>
    </AdminSurfacePanel>
  );
}
