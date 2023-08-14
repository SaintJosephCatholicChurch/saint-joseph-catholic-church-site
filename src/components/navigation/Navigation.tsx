import { styled } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';

import NavigationBar from './NavigationBar';

import type { ChurchDetails, MenuData } from '@/interface';
import type { FC } from 'react';

const StyledNavigation = styled('div')`
  display: flex;
`;

interface NavigationProps {
  churchDetails: ChurchDetails;
  menuDetails: MenuData;
  inCMS?: boolean;
}

const Navigation: FC<NavigationProps> = ({ churchDetails, menuDetails, inCMS = false }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const NavigationDrawerNoSSR = useMemo(
    () =>
      dynamic(() => import('./NavigationDrawer'), {
        ssr: false
      }),
    []
  );

  return (
    <StyledNavigation>
      <NavigationBar
        menuDetails={menuDetails}
        onlineGivingTitle={menuDetails.online_giving_button_text}
        onlineGivingUrl={churchDetails.online_giving_url}
        onMobileOpenToggle={handleDrawerToggle}
        inCMS={inCMS}
      />
      <NavigationDrawerNoSSR menuDetails={menuDetails} mobileOpen={mobileOpen} onMobileOpenToggle={handleDrawerToggle} inCMS={inCMS} />
    </StyledNavigation>
  );
};

export default Navigation;
