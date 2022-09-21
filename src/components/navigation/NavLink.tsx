import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { MouseEvent } from 'react';
import type { MenuLink } from '../../interface';
import useMenuLinkUrl from './hooks/useMenuLinkUrl';

interface NavLinkProps {
  link: MenuLink;
  onClick: (event: MouseEvent) => void;
}

const NavLink = ({ link, onClick }: NavLinkProps) => {
  const url = useMenuLinkUrl(link);
  const { title } = link;

  return (
    <Link href={url} target={url?.startsWith('http') ? '_blank' : undefined}>
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
            fontSize: '15px',
            padding: '10px 20px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          {title}
        </MenuItem>
      </Button>
    </Link>
  );
};

export default NavLink;
