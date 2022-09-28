import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import type { MenuItem, MenuLink } from '../../interface';
import { getMenuLinkUrl } from './hooks/useMenuLinkUrl';
import MobileNavLink from './MobileNavLink';

interface MobileNavItemProps {
  item: MenuItem;
}

function isMenuItem(link: MenuItem | MenuLink): link is MenuItem {
  return Boolean('menu_links' in link && (link as MenuItem).menu_links?.length);
}

const MobileNavItem = ({ item }: MobileNavItemProps) => {
  const [open, setOpen] = useState(false);

  const handleOnClick = useCallback(
    (link: MenuItem | MenuLink) => (event: MouseEvent) => {
      if (isMenuItem(link)) {
        event.stopPropagation();
        setOpen(!open);
        return;
      }

      setOpen(false);
    },
    [open]
  );

  const url = useMemo(() => {
    if (item.menu_links?.length) {
      return undefined;
    }

    return getMenuLinkUrl(item);
  }, [item]);

  const wrappedLink = useMemo(() => {
    const button = (
      <ListItemButton
        key={`drawer-nav-item-${item.title}`}
        sx={{ color: '#fde7a5', textTransform: 'uppercase', '&:hover': { color: '#fde7a5' } }}
        onClick={handleOnClick(item)}
      >
        <ListItemText primary={item.title} />
        {item.menu_links?.length ? open ? <ExpandLess /> : <ExpandMore /> : null}
      </ListItemButton>
    );

    if (!url) {
      return button;
    }

    return (
      <Link target={url?.startsWith('http') ? '_blank' : undefined} href={url}>
        {button}
      </Link>
    );
  }, [handleOnClick, item, open, url]);

  return (
    <>
      {wrappedLink}
      {item.menu_links?.length ? (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.menu_links?.map((link) => (
              <MobileNavLink
                key={`drawer-nav-item-${item.title}-sub-item-${link.title}`}
                link={link}
                onClick={handleOnClick(link)}
              />
            ))}
          </List>
        </Collapse>
      ) : null}
    </>
  );
};

export default MobileNavItem;
