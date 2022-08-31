import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { MouseEvent } from 'react';
import { MenuLink } from '../../lib/menu';
import { CleanLink } from '../common-styled';

interface MobileNavLinkProps {
  link: MenuLink;
  onClick: (event: MouseEvent) => void;
}

const MobileNavLink = ({ link: { url, page, title }, onClick }: MobileNavLinkProps) => {
  return (
    <ListItemButton sx={{ pl: 4, color: '#ffffff' }} onClick={onClick}>
      {url || page ? (
        <CleanLink target={url?.startsWith('http') ? '_blank' : undefined} href={url ?? `/${page}`}>
          {<ListItemText primary={title} />}
        </CleanLink>
      ) : (
        <ListItemText primary={title} />
      )}
    </ListItemButton>
  );
};

export default MobileNavLink;
