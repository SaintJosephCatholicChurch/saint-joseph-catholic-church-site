import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useTheme } from '@mui/system';
import { useCallback, useMemo, useState } from 'react';
import { MAX_APP_WIDTH } from '../../constants';
import navItems from '../../lib/menu';
import styled from '../../util/styled.util';
import Logo from '../logo/Logo';
import MobileNavItem from './MobileNavItem';
import NavItem from './NavItem';

const DRAWER_WIDTH = 240;

const StyledNavigation = styled('div')`
  display: flex;
`;

const StyledDrawerContents = styled('div')`
  padding-top: 16px;
  text-align: center;
`;

const StyledMobileSpacer = styled('div')(
  ({ theme }) => `
    flex-grow: 1;
    ${theme.breakpoints.up('md')}: {
      display: none;
    }
  `
);

const StyledDesktopSpacer = styled('div')(
  ({ theme }) => `
    flex-grow: 1;
    ${theme.breakpoints.down('md')}: {
      display: none;
    }
  `
);

const StyledDesktopNavItems = styled('div')(
  ({ theme }) => `
    display: flex;
    gap: 8px;

    ${theme.breakpoints.down('md')} {
      display: none;
    }
  `
);

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const trigger = useScrollTrigger({ disableHysteresis: true });

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const iOS = useMemo(() => typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent), []);

  const drawer = useMemo(
    () => (
      <StyledDrawerContents onClick={handleDrawerToggle}>
        <Logo responsive={false} />
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.8)', pt: 2 }} />
        <List>
          {navItems.map((item) => (
            <MobileNavItem key={`drawer-nav-item-${item.title}`} item={item} />
          ))}
        </List>
      </StyledDrawerContents>
    ),
    [handleDrawerToggle]
  );

  const container = useMemo(() => (typeof window !== 'undefined' ? window.document.body : undefined), []);

  return (
    <StyledNavigation>
      <AppBar
        component="nav"
        sx={{
          backgroundColor: '#bc2f3b',
          alignItems: 'center'
        }}
      >
        <Toolbar
          sx={{
            width: '100%',
            boxSizing: 'border-box',
            [theme.breakpoints.down('md')]: {
              pl: 3,
              pr: 0
            },
            [theme.breakpoints.up('md')]: {
              transition: 'height 250ms ease',
              height: trigger ? 64 : 92,
              maxWidth: MAX_APP_WIDTH
            }
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: 'none',
              [theme.breakpoints.down('md')]: {
                display: 'block'
              }
            }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
          <StyledMobileSpacer />
          <Logo trigger={trigger} />
          <StyledDesktopSpacer />
          <StyledDesktopNavItems>
            {navItems.map((item) => (
              <NavItem key={`nav-item-${item.title}`} item={item} />
            ))}
          </StyledDesktopNavItems>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <SwipeableDrawer
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
          container={container}
          variant="temporary"
          open={mobileOpen}
          onOpen={handleDrawerToggle}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: 'none',
            [theme.breakpoints.down('md')]: {
              display: 'block'
            },
            '& .MuiDrawer-paper': {
              backgroundColor: '#bc2f3b',
              boxSizing: 'border-box',
              width: DRAWER_WIDTH
            }
          }}
        >
          {drawer}
        </SwipeableDrawer>
      </Box>
    </StyledNavigation>
  );
};

export default Navigation;
