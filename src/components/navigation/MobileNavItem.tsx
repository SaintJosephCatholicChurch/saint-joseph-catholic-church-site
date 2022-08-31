import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { MouseEvent, useCallback, useState } from 'react';
import { MenuItem, MenuLink } from '../../interface';
import { CleanLink } from '../common-styled';
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

  return (
    <>
      <ListItemButton
        key={`drawer-nav-item-${item.title}`}
        sx={{ color: '#fde7a5', textTransform: 'uppercase' }}
        onClick={handleOnClick(item)}
      >
        {item.menu_links?.length ? (
          <ListItemText primary={item.title} />
        ) : (
          <CleanLink target={item.url?.startsWith('http') ? '_blank' : undefined} href={item.url ?? `/${item.page}`}>
            <ListItemText primary={item.title} />
          </CleanLink>
        )}
        {item.menu_links?.length ? open ? <ExpandLess /> : <ExpandMore /> : null}
      </ListItemButton>
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
