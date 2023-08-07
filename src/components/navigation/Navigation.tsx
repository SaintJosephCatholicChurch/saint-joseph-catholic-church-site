import { styled } from '@mui/material/styles';
import { useCallback, useState } from 'react';

import NavigationBar from './NavigationBar';
import NavigationDrawer from './NavigationDrawer';

import type { ChurchDetails, MenuData } from '@/interface';
import type { FC } from 'react';

const StyledNavigation = styled('div')`
  display: flex;
`;

interface NavigationProps {
  churchDetails: ChurchDetails;
  menuDetails: MenuData;
}

const Navigation: FC<NavigationProps> = ({ churchDetails, menuDetails }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  return (
    <StyledNavigation>
      <NavigationBar
        menuDetails={menuDetails}
        onlineGivingTitle={menuDetails.online_giving_button_text}
        onlineGivingUrl={churchDetails.online_giving_url}
        onMobileOpenToggle={handleDrawerToggle}
      />
      <NavigationDrawer menuDetails={menuDetails} mobileOpen={mobileOpen} onMobileOpenToggle={handleDrawerToggle} />
    </StyledNavigation>
  );
};

export default Navigation;
