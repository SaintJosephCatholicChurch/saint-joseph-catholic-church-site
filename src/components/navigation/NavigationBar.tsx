import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';

import { EXTRA_EXTRA_SMALL_BREAKPOINT, MAX_APP_WIDTH } from '../../constants';
import getContainerQuery from '../../util/container.util';
import Logo from '../logo/Logo';
import GiveButton from './GiveButton';
import NavigationItems from './NavigationItems';

import type { MenuData } from '../../interface';

const StyledMobileSpacer = styled('div')(
  ({ theme }) => `
    flex-grow: 1;
    ${theme.breakpoints.up('md')} {
      display: none;
    }
  `
);

const StyledDesktopSpacer = styled('div')`
  flex-grow: 1;
`;

const StyledGiveButtonOffset = styled('div')(
  ({ theme }) => `
    width: 0;

    ${theme.breakpoints.up(1524)} {
      width: 162px;
    }
  `
);

interface NavigationBarProps {
  menuDetails: MenuData;
  onlineGivingTitle: string;
  onlineGivingUrl: string;
  onMobileOpenToggle: () => void;
  inCMS: boolean;
}

const NavigationBar = ({
  menuDetails,
  onlineGivingTitle,
  onlineGivingUrl,
  onMobileOpenToggle,
  inCMS
}: NavigationBarProps) => {
  const theme = useTheme();
  const trigger = useScrollTrigger({ disableHysteresis: true });

  return (
    <AppBar
      component="nav"
      sx={{
        backgroundColor: '#bc2f3b',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }}
      position={inCMS ? 'absolute' : undefined}
    >
      <StyledGiveButtonOffset />
      <StyledDesktopSpacer />
      <Toolbar
        sx={{
          width: '100%',
          boxSizing: 'border-box',
          height: 70,
          [getContainerQuery(theme.breakpoints.down('lg'), inCMS)]: {
            pl: 1,
            pr: 1.5
          },
          [getContainerQuery(theme.breakpoints.down('md'), inCMS)]: {
            pl: 3,
            pr: 0
          },
          [getContainerQuery(theme.breakpoints.up('lg'), inCMS)]: {
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
          onClick={onMobileOpenToggle}
          sx={{
            display: 'none',
            [getContainerQuery(theme.breakpoints.down('md'), inCMS)]: {
              display: 'block'
            },
            [getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT), inCMS)]: {
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
        <Logo details={menuDetails.logo} trigger={trigger} inCMS={inCMS} />
        <StyledDesktopSpacer />
        <NavigationItems menuDetails={menuDetails} inCMS={inCMS} />
      </Toolbar>
      <StyledDesktopSpacer />
      <GiveButton title={onlineGivingTitle} onlineGivingUrl={onlineGivingUrl} inCMS={inCMS} />
    </AppBar>
  );
};

export default NavigationBar;
