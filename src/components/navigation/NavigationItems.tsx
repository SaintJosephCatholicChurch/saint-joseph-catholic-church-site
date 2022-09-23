import { styled } from '@mui/material/styles';
import { MenuData } from '../../interface';
import NavItem from './NavItem';

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

interface NavigationItemsProps {
  menuDetails: MenuData;
  size?: 'small' | 'normal';
}

const NavigationItems = ({ menuDetails, size }: NavigationItemsProps) => {
  return (
    <StyledDesktopNavItems>
      {menuDetails.menu_items.map((item) => (
        <NavItem key={`nav-item-${item.title}`} item={item} size={size} />
      ))}
    </StyledDesktopNavItems>
  );
};

export default NavigationItems;
