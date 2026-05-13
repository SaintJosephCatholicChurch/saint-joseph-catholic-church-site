import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { forwardRef } from 'react';

import useMenuLinkUrl from './hooks/useMenuLinkUrl';

import type { KeyboardEvent, MouseEvent } from 'react';
import type { MenuLink } from '../../interface';

interface NavLinkProps {
  disableNavigation?: boolean;
  link: MenuLink;
  onClick: (event: MouseEvent) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  selectionProps?: Record<string, string>;
}

const NavLink = forwardRef<HTMLButtonElement, NavLinkProps>(
  ({ disableNavigation = false, link, onClick, onKeyDown, selectionProps }, ref) => {
    const url = useMenuLinkUrl(link);
    const { title } = link;
    const hasUrl = Boolean(url);
    const navigationDisabled = disableNavigation || Boolean(selectionProps);
    const isExternalLink = url?.startsWith('http') ?? false;

    return (
      <Button
        LinkComponent={!navigationDisabled && hasUrl && !isExternalLink ? Link : undefined}
        ref={ref}
        href={!navigationDisabled && hasUrl && !isExternalLink ? url : undefined}
        {...selectionProps}
        sx={{
          color: '#680b12',
          padding: 0,
          textTransform: 'none',
          '&:hover': {
            color: '#2e2e2e'
          },
          width: '100%'
        }}
        onClick={(event) => {
          onClick(event);

          if (!navigationDisabled && isExternalLink && url) {
            window.open(url, '_blank', 'noopener,noreferrer');
          }
        }}
        onKeyDown={onKeyDown}
      >
        <MenuItem
          sx={{
            width: '100%',
            fontSize: '15px',
            padding: '10px 20px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          {title}
        </MenuItem>
      </Button>
    );
  }
);

NavLink.displayName = 'NavLink';

export default NavLink;
