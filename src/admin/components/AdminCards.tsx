'use client';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
        padding: { md: 1.5, xs: 1 },
        width: '100%',
        height: '100%'
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

interface AdminSortableAccordionRepeaterCardProps {
  active?: boolean;
  children?: ReactNode;
  defaultExpanded?: boolean;
  dragHandleLabel?: string;
  expanded?: boolean;
  id: string;
  onExpandedChange?: (expanded: boolean) => void;
  onExpandedEntered?: () => void;
  onSummaryClick?: () => void;
  onRemove?: () => void;
  preview?: ReactNode;
  removeButtonLabel?: string;
  summary?: ReactNode;
  summaryActions?: ReactNode;
  title: string;
}

export function AdminSortableAccordionRepeaterCard({
  active = false,
  children,
  defaultExpanded = false,
  dragHandleLabel,
  expanded,
  id,
  onExpandedChange,
  onExpandedEntered,
  onSummaryClick,
  onRemove,
  preview,
  removeButtonLabel = 'Remove item',
  summary,
  summaryActions,
  title
}: AdminSortableAccordionRepeaterCardProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const shouldRenderDetails = Boolean(children) || Boolean(onRemove);
  const expansionProps = typeof expanded === 'boolean' ? { expanded } : { defaultExpanded };

  function handleSummaryClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!onSummaryClick) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    onSummaryClick();
  }

  return (
    <Accordion
      {...expansionProps}
      disableGutters
      onChange={(_event, nextExpanded) => onExpandedChange?.(nextExpanded)}
      ref={setNodeRef}
      slotProps={{
        transition: {
          onEntered: () => onExpandedEntered?.()
        }
      }}
      sx={{
        '&::before': { display: 'none' },
        background: '#fbfaf8',
        border: active ? '1px solid rgba(127, 35, 44, 0.42)' : '1px solid rgba(191, 48, 60, 0.12)',
        borderRadius: '4px',
        boxShadow: 'none',
        opacity: isDragging ? 0.92 : 1,
        overflow: 'hidden',
        position: 'relative',
        transform: CSS.Transform.toString(transform),
        transition,
        ...(active
          ? {
              boxShadow: '0 16px 30px rgba(92, 24, 32, 0.14)'
            }
          : null)
      }}
    >
      <AccordionSummary
        component="div"
        expandIcon={onSummaryClick ? null : <ExpandMoreIcon />}
        onClick={handleSummaryClick}
        sx={{
          '& .MuiAccordionSummary-content': { alignItems: 'center', margin: 0, minWidth: 0 },
          cursor: onSummaryClick ? 'pointer' : 'default',
          minHeight: 88,
          px: 2,
          py: 1.5
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, width: '100%' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <IconButton
              aria-label={dragHandleLabel || `Reorder ${title}`}
              component="div"
              edge="start"
              size="small"
              {...attributes}
              {...listeners}
              onClick={(event) => event.stopPropagation()}
              sx={{ color: '#7a5d50', cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <DragIndicatorIcon fontSize="small" />
            </IconButton>
            {preview ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  background: 'rgba(191, 48, 60, 0.04)',
                  border: '1px solid rgba(191, 48, 60, 0.12)',
                  borderRadius: '4px',
                  flexShrink: 0,
                  height: 56,
                  overflow: 'hidden',
                  width: 92
                }}
              >
                {preview}
              </Stack>
            ) : null}
            <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {title}
              </Typography>
              {summary ? (
                <Typography
                  sx={{
                    color: '#6e5b53',
                    lineHeight: 1.5,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  variant="body2"
                >
                  {summary}
                </Typography>
              ) : null}
            </Stack>
          </Stack>
          {summaryActions ? (
            <Stack direction="row" spacing={1} alignItems="center" onClick={(event) => event.stopPropagation()}>
              {summaryActions}
            </Stack>
          ) : null}
        </Stack>
      </AccordionSummary>
      {shouldRenderDetails ? (
        <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
          <Stack spacing={2}>
            {children}
            {onRemove ? (
              <Button variant="outlined" color="inherit" onClick={onRemove}>
                {removeButtonLabel}
              </Button>
            ) : null}
          </Stack>
        </AccordionDetails>
      ) : null}
    </Accordion>
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
