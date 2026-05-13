import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';

import { getMenuLinkUrl } from './hooks/useMenuLinkUrl';
import MobileNavLink from './MobileNavLink';

import type { MouseEvent } from 'react';
import type { MenuItem, MenuLink } from '../../interface';

interface MobileNavItemProps {
  disableNavigation?: boolean;
  getMenuLinkProps?: (itemIndex: number, linkIndex: number) => Record<string, string>;
  item: MenuItem;
  itemIndex: number;
  selectionProps?: Record<string, string>;
}

function isMenuItem(link: MenuItem | MenuLink): link is MenuItem {
  return Boolean('menu_links' in link && link.menu_links?.length);
}

const MobileNavItem = ({
  disableNavigation = false,
  getMenuLinkProps,
  item,
  itemIndex,
  selectionProps
}: MobileNavItemProps) => {
  const [open, setOpen] = useState(false);
  const navigationDisabled = disableNavigation || Boolean(selectionProps);

  const toggleOpen = useCallback((event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen((currentOpen) => !currentOpen);
  }, []);

  const handleOnClick = useCallback(
    (link: MenuItem | MenuLink) => (event: MouseEvent) => {
      if (isMenuItem(link)) {
        return;
      }

      setOpen(false);
    },
    []
  );

  const url = useMemo(() => {
    if (item.menu_links?.length) {
      return undefined;
    }

    return getMenuLinkUrl(item);
  }, [item]);

  const wrappedLink = useMemo(
    () => (
      <ListItemButton
        LinkComponent={!navigationDisabled && url ? Link : undefined}
        target={!navigationDisabled && url?.startsWith('http') ? '_blank' : undefined}
        href={!navigationDisabled && url ? url : undefined}
        key={`drawer-nav-item-${item.title}`}
        sx={{ color: '#fde7a5', textTransform: 'uppercase', '&:hover': { color: '#fde7a5' } }}
        onClick={handleOnClick(item)}
      >
        {item.menu_links?.length ? (
          <>
            <Box sx={{ alignItems: 'center', display: 'flex', flex: 1, minWidth: 0 }} {...selectionProps}>
              <ListItemText primary={item.title} />
            </Box>
            <IconButton
              aria-label={open ? `Collapse ${item.title}` : `Expand ${item.title}`}
              edge="end"
              onClick={toggleOpen}
              size="small"
              sx={{ color: '#fde7a5', ml: 1 }}
            >
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </>
        ) : (
          <ListItemText primary={item.title} {...selectionProps} />
        )}
      </ListItemButton>
    ),
    [handleOnClick, item, open, selectionProps, toggleOpen, url]
  );

  return (
    <>
      {wrappedLink}
      {item.menu_links?.length ? (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.menu_links?.map((link) => (
              <MobileNavLink
                disableNavigation={navigationDisabled}
                selectionProps={getMenuLinkProps?.(itemIndex, item.menu_links?.indexOf(link) || 0)}
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
