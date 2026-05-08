'use client';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { ReactNode } from 'react';
import type { ButtonProps } from '@mui/material/Button';
import type { StackProps } from '@mui/material/Stack';
import type { SxProps, Theme } from '@mui/material/styles';

function mergeSx(base: SxProps<Theme>, overrides?: SxProps<Theme>): SxProps<Theme> {
  if (!overrides) {
    return base;
  }

  return [base, overrides] as SxProps<Theme>;
}

interface AdminSectionCardProps {
  actions?: ReactNode;
  children: ReactNode;
  description?: string;
  headerActions?: ReactNode;
  title: string;
}

export function AdminSectionCard({ actions, children, description, headerActions, title }: AdminSectionCardProps) {
  return (
    <Stack
      spacing={2}
      sx={{
        background: '#ffffff',
        border: '1px solid rgba(191, 48, 60, 0.12)',
        borderRadius: '4px',
        minWidth: 0,
        padding: { md: 2.5, xs: 2 },
        width: '100%'
      }}
    >
      <Stack spacing={description ? 1 : 0}>
        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ flexWrap: 'wrap', rowGap: 1 }}
        >
          <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {headerActions ? (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
              {headerActions}
            </Stack>
          ) : null}
        </Stack>
        {description ? <Typography sx={{ color: '#616169', lineHeight: 1.7 }}>{description}</Typography> : null}
      </Stack>
      {children}
      {actions ? (
        <>
          <Divider />
          {actions}
        </>
      ) : null}
    </Stack>
  );
}

interface AdminRepeaterCardProps {
  actions?: ReactNode;
  children: ReactNode;
  title: string;
}

export function AdminRepeaterCard({ actions, children, title }: AdminRepeaterCardProps) {
  return (
    <Stack
      spacing={2}
      sx={{
        background: '#fbfaf8',
        border: '1px solid rgba(191, 48, 60, 0.12)',
        borderRadius: '4px',
        p: 2
      }}
    >
      <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5} justifyContent="space-between">
        <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
        {actions}
      </Stack>
      {children}
    </Stack>
  );
}

interface AdminSelectableCardProps extends Omit<ButtonProps, 'children' | 'color' | 'variant'> {
  active: boolean;
  activeShadow?: boolean;
  children: ReactNode;
}

export function AdminSelectableCard({
  active,
  activeShadow = false,
  children,
  sx,
  ...buttonProps
}: AdminSelectableCardProps) {
  return (
    <Button
      color="inherit"
      variant={active ? 'contained' : 'outlined'}
      sx={mergeSx(
        {
          alignItems: 'flex-start',
          background: active
            ? 'linear-gradient(135deg, #7f232c 0%, #5c1820 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(250,245,238,0.92))',
          borderColor: active ? '#7f232c' : 'rgba(127, 35, 44, 0.16)',
          borderRadius: '4px',
          boxShadow: active && activeShadow ? '0 18px 28px rgba(92, 24, 32, 0.18)' : 'none',
          color: active ? '#ffffff' : '#222222',
          justifyContent: 'flex-start',
          textAlign: 'left',
          textTransform: 'none',
          transition: 'transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease',
          '&:hover': {
            background: active ? 'linear-gradient(135deg, #6c1d26 0%, #49131a 100%)' : 'rgba(127, 35, 44, 0.05)',
            borderColor: '#7f232c',
            transform: 'translateY(-1px)'
          }
        },
        sx
      )}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}

interface AdminSurfacePanelProps extends StackProps {
  tone?: 'content' | 'plain' | 'sidebar';
}

export function AdminSurfacePanel({ children, sx, tone = 'content', ...stackProps }: AdminSurfacePanelProps) {
  const background =
    tone === 'sidebar'
      ? 'linear-gradient(180deg, rgba(255,255,255,0.84), rgba(250,245,238,0.92))'
      : tone === 'plain'
        ? '#ffffff'
        : 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(250,245,238,0.94))';

  return (
    <Stack
      sx={mergeSx(
        {
          background,
          border: '1px solid rgba(127, 35, 44, 0.12)',
          borderRadius: '4px',
          boxShadow: '0 18px 40px rgba(57, 33, 24, 0.08)'
        },
        sx
      )}
      {...stackProps}
    >
      {children}
    </Stack>
  );
}
