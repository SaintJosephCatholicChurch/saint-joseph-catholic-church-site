import { styled } from '@mui/material/styles';

import Navigation from '../navigation/Navigation';
import churchDetails from '../../lib/church_details';

import type { TemplatePreviewComponent } from '@staticcms/core';
import type { MenuData } from '@/interface';

const StyledNavigationWrapper = styled('div')`
  container: page / inline-size;
  font-family:
    Open Sans,
    Roboto,
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Oxygen-Sans,
    Ubuntu,
    Cantarell,
    Helvetica Neue,
    sans-serif;
  background-color: #f5f4f3;
  color: #222;
  font-weight: 200;
  font-size: 16px;
  position: relative;
  min-height: 500px;
`;

const NavigationPreview: TemplatePreviewComponent<MenuData> = ({ entry }) => {
  return (
    <StyledNavigationWrapper id="drawer-container">
      <Navigation menuDetails={entry.data} churchDetails={churchDetails} inCMS />
    </StyledNavigationWrapper>
  );
};

export default NavigationPreview;
