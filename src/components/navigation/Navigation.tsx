/* eslint-disable @next/next/no-img-element */
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useTheme } from '@mui/system';
import { useCallback, useMemo, useState } from 'react';
import { MAX_APP_WIDTH } from '../../constants';
import config from '../../lib/config';
import navItems from '../../lib/menu';
import MobileNavItem from './MobileNavItem';
import NavItem from './NavItem';

const DRAWER_WIDTH = 240;

const StyledLink = styled('a')`
  display: flex;
`;

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const trigger = useScrollTrigger();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const iOS = useMemo(() => typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent), []);

  const drawer = useMemo(
    () => (
      <Box
        onClick={handleDrawerToggle}
        sx={{
          pt: 2,
          textAlign: 'center'
        }}
      >
        <Box
          component="img"
          src={config.logo}
          alt={config.site_title}
          sx={{
            [theme.breakpoints.down('md')]: {
              height: '50px',
              padding: '3px 0',
              boxSizing: 'border-box'
            },
            [theme.breakpoints.up('md')]: {
              transition: 'height,padding 0.5s ease;',
              height: '100%',
              padding: trigger ? '8px 0' : '16px 0',
              boxSizing: 'border-box'
            }
          }}
        />
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.8)', pt: 1 }} />
        <List>
          {navItems.map((item) => (
            <MobileNavItem key={`drawer-nav-item-${item.title}`} item={item} />
          ))}
        </List>
      </Box>
    ),
    [handleDrawerToggle, theme.breakpoints, trigger]
  );

  const container = useMemo(() => (typeof window !== 'undefined' ? window.document.body : undefined), []);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        component="nav"
        sx={{
          backgroundColor: 'rgba(10, 10, 10, 1)',
          alignItems: 'center'
        }}
      >
        <Toolbar
          sx={{
            width: '100%',
            boxSizing: 'border-box',
            [theme.breakpoints.down('md')]: {
              pl: 3,
              pr: 1
            },
            [theme.breakpoints.up('md')]: {
              transition: 'height 0.5s ease;',
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
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              [theme.breakpoints.up('md')]: {
                display: 'none'
              }
            }}
          />
          <StyledLink sx={{ height: '100%' }} href="/">
            <Box
              component="img"
              src={config.logo}
              alt={config.site_title}
              sx={{
                [theme.breakpoints.down('md')]: {
                  height: '50px',
                  padding: '3px 0',
                  boxSizing: 'border-box'
                },
                [theme.breakpoints.up('md')]: {
                  transition: 'height,padding 0.5s ease;',
                  height: '100%',
                  padding: trigger ? '8px 0' : '16px 0',
                  boxSizing: 'border-box'
                }
              }}
            />
          </StyledLink>
          <Box
            sx={{
              flexGrow: 1,
              [theme.breakpoints.down('md')]: {
                display: 'none'
              }
            }}
          />
          <Box
            sx={{
              display: 'flex',
              [theme.breakpoints.down('md')]: {
                display: 'none'
              }
            }}
          >
            {navItems.map((item) => (
              <NavItem key={`nav-item-${item.title}`} item={item} />
            ))}
          </Box>
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
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              backgroundColor: '#680b12',
              boxSizing: 'border-box',
              width: DRAWER_WIDTH
            }
          }}
        >
          {drawer}
        </SwipeableDrawer>
      </Box>
    </Box>
  );
}
