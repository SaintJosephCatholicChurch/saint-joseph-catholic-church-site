import { styled } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import churchDetails from '../../lib/church_details';
import menuDetails from '../../lib/menu';
import NavigationBar from './NavigationBar';
import NavigationDrawer from './NavigationDrawer';

const StyledNavigation = styled('div')`
  display: flex;
`;

const Navigation = () => {
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
