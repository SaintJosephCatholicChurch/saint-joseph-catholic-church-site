import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { styled, useTheme } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useMemo } from 'react';

import Logo from '../logo/Logo';
import MobileNavItem from './MobileNavItem';

import type { MenuData } from '../../interface';

const DRAWER_WIDTH = 240;

const StyledDrawerContents = styled('div')`
  padding-top: 16px;
  text-align: center;
`;

interface NavigationDrawerProps {
  menuDetails: MenuData;
  mobileOpen: boolean;
  onMobileOpenToggle: () => void;
}

const NavigationDrawer = ({ menuDetails, mobileOpen, onMobileOpenToggle }: NavigationDrawerProps) => {
  const theme = useTheme();

  const iOS = useMemo(() => typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent), []);

  const drawer = useMemo(
    () => (
      <StyledDrawerContents onClick={onMobileOpenToggle}>
        <Logo details={menuDetails.logo} responsive={false} />
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.8)', pt: 2 }} />
        <List>
          {menuDetails.menu_items.map((item) => (
            <MobileNavItem key={`drawer-nav-item-${item.title}`} item={item} />
          ))}
        </List>
      </StyledDrawerContents>
    ),
    [menuDetails.logo, menuDetails.menu_items, onMobileOpenToggle]
  );

  const container = useMemo(() => (typeof window !== 'undefined' ? window.document.body : undefined), []);

  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      container={container}
      variant="temporary"
      open={mobileOpen}
      onOpen={onMobileOpenToggle}
      onClose={onMobileOpenToggle}
      ModalProps={{
        keepMounted: true // Better open performance on mobile.
      }}
      sx={{
        display: 'none',
        [theme.breakpoints.down('md')]: {
          display: 'block'
        },
        width: '80%',
        maxWidth: DRAWER_WIDTH,
        '& .MuiBackdrop-root': {
          width: '100%'
        },
        '& .MuiDrawer-paper': {
          backgroundColor: '#bc2f3b',
          boxSizing: 'border-box',
          width: '80%',
          maxWidth: DRAWER_WIDTH
        }
      }}
    >
      {drawer}
    </SwipeableDrawer>
  );
};

export default NavigationDrawer;
