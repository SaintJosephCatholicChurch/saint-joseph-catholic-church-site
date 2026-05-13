import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';

import useMenuLinkUrl from './hooks/useMenuLinkUrl';

import type { MouseEvent } from 'react';
import type { MenuLink } from '../../interface';

interface MobileNavLinkProps {
  disableNavigation?: boolean;
  link: MenuLink;
  onClick: (event: MouseEvent) => void;
  selectionProps?: Record<string, string>;
}

const MobileNavLink = ({ disableNavigation = false, link, onClick, selectionProps }: MobileNavLinkProps) => {
  const url = useMenuLinkUrl(link);
  const { title } = link;
  const navigationDisabled = disableNavigation || Boolean(selectionProps);

  return (
    <ListItemButton
      LinkComponent={!navigationDisabled && url ? Link : undefined}
      href={!navigationDisabled ? url : undefined}
      target={!navigationDisabled && url?.startsWith('http') ? '_blank' : undefined}
      rel={!navigationDisabled && url?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...selectionProps}
      sx={{ pl: 4, color: '#ffffff', '&:hover': { color: '#ffffff' }, width: '100%' }}
      onClick={onClick}
    >
      <ListItemText primary={title} />
    </ListItemButton>
  );
};

export default MobileNavLink;
