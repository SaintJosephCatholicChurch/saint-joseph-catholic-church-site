import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';

import { EXTRA_EXTRA_SMALL_BREAKPOINT, MAX_APP_WIDTH } from '../../constants';
import getContainerQuery from '../../util/container.util';
import transientOptions from '../../util/transientOptions';
import Logo from '../logo/Logo';
import GiveButton from './GiveButton';
import NavigationItems from './NavigationItems';

import type { MenuData } from '../../interface';
import type { NavigationAdminSelection } from './Navigation';

interface StyledMobileSpacerProps {
  $inCMS: boolean;
}

const StyledMobileSpacer = styled(
  'div',
  transientOptions
)<StyledMobileSpacerProps>(
  ({ theme, $inCMS }) => `
    flex-grow: 1;
    ${getContainerQuery(theme.breakpoints.up('md'), $inCMS)} {
      display: none;
    }
  `
);

const StyledDesktopSpacer = styled('div')`
  flex-grow: 1;
`;

interface StyledGiveButtonOffsetProps {
  $inCMS: boolean;
}

const StyledGiveButtonOffset = styled(
  'div',
  transientOptions
)<StyledGiveButtonOffsetProps>(
  ({ theme, $inCMS }) => `
    width: 0;

    ${getContainerQuery(theme.breakpoints.up(1524), $inCMS)} {
      width: 162px;
    }
  `
);

interface NavigationBarProps {
  adminSelection?: NavigationAdminSelection;
  menuDetails: MenuData;
  onlineGivingTitle: string;
  onlineGivingUrl: string;
  onMobileOpenToggle: () => void;
  inCMS: boolean;
}

const NavigationBar = ({
  adminSelection,
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
      <StyledGiveButtonOffset $inCMS={inCMS} />
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
        <StyledMobileSpacer $inCMS={inCMS} />
        <Logo
          details={menuDetails.logo}
          trigger={trigger}
          inCMS={inCMS}
          primaryProps={adminSelection?.logoPrimaryProps}
          secondaryProps={adminSelection?.logoSecondaryProps}
        />
        <StyledDesktopSpacer />
        <NavigationItems
          disableNavigation={adminSelection?.disableMenuLinkNavigation}
          menuDetails={menuDetails}
          inCMS={inCMS}
          getMenuItemProps={adminSelection?.getMenuItemProps}
          getMenuLinkProps={adminSelection?.getMenuLinkProps}
        />
      </Toolbar>
      <StyledDesktopSpacer />
      <GiveButton
        title={onlineGivingTitle}
        onlineGivingUrl={onlineGivingUrl}
        inCMS={inCMS}
        selectionProps={adminSelection?.giveButtonProps}
      />
    </AppBar>
  );
};

export default NavigationBar;
