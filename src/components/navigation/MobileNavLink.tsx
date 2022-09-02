import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { MouseEvent } from 'react';
import { MenuLink } from '../../interface';
import useMenuLinkUrl from './hooks/useMenuLinkUrl';

interface MobileNavLinkProps {
  link: MenuLink;
  onClick: (event: MouseEvent) => void;
}

const MobileNavLink = ({ link, onClick }: MobileNavLinkProps) => {
  const url = useMenuLinkUrl(link);
  const { title } = link;

  return (
    <ListItemButton
      sx={{ pl: 4, color: '#ffffff' }}
      onClick={onClick}
      href={url}
      target={url?.startsWith('http') ? '_blank' : undefined}
    >
      <ListItemText primary={title} />
    </ListItemButton>
  );
};

export default MobileNavLink;
