import { styled } from '@mui/material/styles';

import getContainerQuery from '../../util/container.util';
import transientOptions from '../../util/transientOptions';
import NavItem from './NavItem';

import type { MenuData } from '../../interface';

interface StyledDesktopNavItemsProps {
  $inCMS: boolean;
}

const StyledDesktopNavItems = styled(
  'div',
  transientOptions
)<StyledDesktopNavItemsProps>(
  ({ theme, $inCMS }) => `
    display: flex;
    gap: 8px;

    ${getContainerQuery(theme.breakpoints.down('lg'), $inCMS)} {
      gap: 4px;
    }

    ${getContainerQuery(theme.breakpoints.down('md'), $inCMS)} {
      display: none;
    }
  `
);

interface NavigationItemsProps {
  disableNavigation?: boolean;
  getMenuItemProps?: (itemIndex: number) => Record<string, string>;
  getMenuLinkProps?: (itemIndex: number, linkIndex: number) => Record<string, string>;
  menuDetails: MenuData;
  size?: 'small' | 'normal';
  inCMS: boolean;
}

const NavigationItems = ({
  disableNavigation = false,
  getMenuItemProps,
  getMenuLinkProps,
  menuDetails,
  size,
  inCMS
}: NavigationItemsProps) => {
  return (
    <StyledDesktopNavItems $inCMS={inCMS}>
      {menuDetails.menu_items.map((item, itemIndex) => (
        <NavItem
          disableNavigation={disableNavigation}
          key={`nav-item-${item.title}`}
          item={item}
          itemIndex={itemIndex}
          size={size}
          inCMS={inCMS}
          selectionProps={getMenuItemProps?.(itemIndex)}
          getMenuLinkProps={getMenuLinkProps}
        />
      ))}
    </StyledDesktopNavItems>
  );
};

export default NavigationItems;
