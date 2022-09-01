import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { MouseEvent } from 'react';
import { MenuLink } from '../../interface';
import { CleanLink } from '../common-styled';

interface NavLinkProps {
  link: MenuLink;
  onClick: (event: MouseEvent) => void;
}

const NavLink = ({ link: { url, page, title }, onClick }: NavLinkProps) => {
  return (
    <Button
      sx={{
        color: '#680b12',
        padding: 0,
        textTransform: 'none',
        '&:hover': {
          color: '#2e2e2e'
        }
      }}
    >
      <MenuItem
        onClick={onClick}
        sx={{
          width: '100%',
          fontSize: '14px',
          padding: '10px 20px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        {url || page ? (
          <CleanLink target={url?.startsWith('http') ? '_blank' : undefined} href={url ?? `/${page}`}>
            {title}
          </CleanLink>
        ) : (
          title
        )}
      </MenuItem>
    </Button>
  );
};

export default NavLink;
