import { styled } from '@mui/material/styles';
import { memo, useEffect, useState } from 'react';

import transientOptions from '../util/transientOptions';

import type { ReactNode } from 'react';

interface StyledTabPanelProps {
  $inactive: boolean;
}

const StyledTabPanel = styled(
  'div',
  transientOptions
)<StyledTabPanelProps>(
  ({ $inactive }) => `
    width: 100%;
    box-sizing: border-box;
    ${$inactive ? 'visibility: hidden;' : ''}
  `
);

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel = memo(({ children, value, index, ...other }: TabPanelProps) => {
  const [inactive, setInactive] = useState(index !== 0);

  useEffect(() => {
    setInactive(value !== index);
  }, [index, value]);

  return (
    <StyledTabPanel
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      $inactive={inactive}
      {...other}
    >
      {value === index ? children : null}
    </StyledTabPanel>
  );
});

TabPanel.displayName = 'TabPanel';

export default TabPanel;
