import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

import Logo from '../logo/Logo';
import GiveButton from '../navigation/GiveButton';
import NavigationDrawer from '../navigation/NavigationDrawer';
import NavigationItems from '../navigation/NavigationItems';

import type { PreviewTemplateComponentProps } from '@staticcms/core';
import type { MenuData } from '../../interface';

const StyledNavigationWrapper = styled('div')`
  display: flex;
  justify-content: center;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  min-width: 1160px;
`;

const StyledNavigation = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 92px;
  background-color: #bc2f3b;
  padding: 0;
  box-sizing: border-box;
`;

const StyledSpacer = styled('div')`
  flex-grow: 1;
`;

const NavigationPreview = ({ entry }: PreviewTemplateComponentProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const data = useMemo(() => entry.toJS().data as MenuData, [entry]);

  return (
    <StyledNavigationWrapper>
      <StyledNavigation>
        <Logo details={data.logo} size="small" />
        <StyledSpacer />
        <NavigationItems menuDetails={data} size="small" />
        <StyledSpacer />
        <GiveButton title={data.online_giving_button_text} onlineGivingUrl="#" size="small" />
      </StyledNavigation>
      {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
      <NavigationDrawer menuDetails={data} mobileOpen={true} onMobileOpenToggle={() => {}} />
    </StyledNavigationWrapper>
  );
};

export default NavigationPreview;
