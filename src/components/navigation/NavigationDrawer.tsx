import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { styled, useTheme } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useMemo } from 'react';

import getContainerQuery from '../../util/container.util';
import useModalContainer from '../../util/useModalContainer';
import Logo from '../logo/Logo';
import MobileNavItem from './MobileNavItem';

import type { MenuData } from '../../interface';
import type { NavigationAdminSelection } from './Navigation';

const DRAWER_WIDTH = 240;

const StyledDrawerContents = styled('div')`
  padding-top: 16px;
  text-align: center;
`;

interface NavigationDrawerProps {
  adminSelection?: NavigationAdminSelection;
  menuDetails: MenuData;
  mobileOpen: boolean;
  onMobileOpenToggle: () => void;
  inCMS: boolean;
}

const NavigationDrawer = ({
  adminSelection,
  menuDetails,
  mobileOpen,
  onMobileOpenToggle,
  inCMS
}: NavigationDrawerProps) => {
  const theme = useTheme();

  const iOS = useMemo(() => typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent), []);

  const drawer = useMemo(
    () => (
      <StyledDrawerContents onClick={onMobileOpenToggle}>
        <Logo details={menuDetails.logo} inCMS={inCMS} />
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.8)', pt: 2 }} />
        <List>
          {menuDetails.menu_items.map((item, itemIndex) => (
            <MobileNavItem
              disableNavigation={adminSelection?.disableMenuLinkNavigation}
              key={`drawer-nav-item-${item.title}`}
              item={item}
              selectionProps={adminSelection?.getMenuItemProps?.(itemIndex)}
              getMenuLinkProps={adminSelection?.getMenuLinkProps}
              itemIndex={itemIndex}
            />
          ))}
        </List>
      </StyledDrawerContents>
    ),
    [adminSelection, inCMS, menuDetails.logo, menuDetails.menu_items, onMobileOpenToggle]
  );

  const container = useModalContainer();

  if (inCMS) {
    return (
      <Box
        sx={{
          display: 'none',
          inset: 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          position: 'absolute',
          zIndex: theme.zIndex.drawer,
          [getContainerQuery(theme.breakpoints.down('md'), inCMS)]: {
            display: 'block'
          }
        }}
      >
        <Box
          onClick={onMobileOpenToggle}
          sx={{
            backgroundColor: 'rgba(34, 17, 17, 0.2)',
            inset: 0,
            opacity: mobileOpen ? 1 : 0,
            position: 'absolute',
            transition: theme.transitions.create('opacity', {
              duration: theme.transitions.duration.enteringScreen
            })
          }}
        />
        <Box
          aria-hidden={!mobileOpen}
          role="dialog"
          sx={{
            backgroundColor: '#bc2f3b',
            bottom: 0,
            boxShadow: '0 24px 40px rgba(34, 17, 17, 0.24)',
            boxSizing: 'border-box',
            left: 0,
            maxWidth: DRAWER_WIDTH,
            overflowY: 'auto',
            position: 'absolute',
            top: 0,
            transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: theme.transitions.create('transform', {
              duration: theme.transitions.duration.enteringScreen,
              easing: theme.transitions.easing.easeOut
            }),
            width: 'min(80%, 240px)'
          }}
        >
          {drawer}
        </Box>
      </Box>
    );
  }

  return container ? (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      variant="temporary"
      open={mobileOpen}
      onOpen={onMobileOpenToggle}
      onClose={onMobileOpenToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
        container
      }}
      sx={{
        display: 'none',
        [getContainerQuery(theme.breakpoints.down('md'), inCMS)]: {
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
  ) : null;
};

export default NavigationDrawer;
