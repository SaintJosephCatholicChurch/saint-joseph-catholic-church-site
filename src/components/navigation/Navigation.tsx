import { faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import { styled, useTheme } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useCallback, useMemo, useState } from 'react';
import { EXTRA_EXTRA_SMALL_BREAKPOINT, MAX_APP_WIDTH } from '../../constants';
import navItems from '../../lib/menu';
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
    ${theme.breakpoints.up('md')} {
      display: none;
    }
  `
);

const StyledDesktopSpacer = styled('div')(
  ({ theme }) => `
    flex-grow: 1;
  `
);

const StyledDesktopNavItems = styled('div')(
  ({ theme }) => `
    display: flex;
    gap: 8px;

    ${theme.breakpoints.down('lg')} {
      gap: 4px;
    }

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
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <StyledDesktopSpacer />
        <Toolbar
          sx={{
            width: '100%',
            boxSizing: 'border-box',
            height: 70,
            [theme.breakpoints.down('lg')]: {
              pl: 1,
              pr: 1.5
            },
            [theme.breakpoints.down('md')]: {
              pl: 3,
              pr: 0
            },
            [theme.breakpoints.up('lg')]: {
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
              },
              [theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)]: {
                width: '32px',
                height: '32px',
                padding: '0',
                '.MuiSvgIcon-root': {
                  width: '32px',
                  height: '32px'
                }
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
        <StyledDesktopSpacer />
        <Button
          href="https://www.osvhub.com/stjosephchurchbluffton/giving/funds"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: '#bf303c',
            backgroundColor: '#ffffff',
            borderRadius: 0,
            position: 'relative',
            right: 0,
            top: 0,
            bottom: 0,
            fontFamily: "'Oswald', Helvetica, Arial, sans-serif",
            fontSize: '17px',
            display: 'flex',
            alignItems: 'center',
            padding: '1px 36px 0',
            gap: '8px',
            height: 70,
            width: 162,
            '&:hover': {
              color: '#822129',
              backgroundColor: 'rgba(255, 255, 255, 0.95)'
            },
            [theme.breakpoints.up('lg')]: {
              transition: 'height 250ms ease',
              height: trigger ? 64 : 92
            },
            [theme.breakpoints.down('lg')]: {
              padding: '1px 24px 0'
            },
            [theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)]: {
              padding: '1px 16px 0'
            }
          }}
        >
          <FontAwesomeIcon icon={faHandHoldingDollar} style={{ width: '24px' }} />
          Give
        </Button>
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
      </Box>
    </StyledNavigation>
  );
};

export default Navigation;
