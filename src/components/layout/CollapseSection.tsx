import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Collapse from '@mui/material/Collapse';
import { memo, useCallback, useMemo, useState } from 'react';
import styled from '../../util/styled.util';

interface StyledArrowIconWrapperProps {
  collapsed: boolean;
}

const StyledArrowIconWrapper = styled('div', ['collapsed'])<StyledArrowIconWrapperProps>(
  ({ collapsed }) => `
    transition: transform 333ms ease-out;
    transform: rotate(${collapsed ? '-90deg' : '0deg'});
    width: 24px;
    height: 24px;
  `
);

const StyledHeader = styled('div')`
  flexgrow: 1;
  display: flex;
  align-items: center;
  gap: 4px;
`;

interface CollapseSectionProps {
  header: React.ReactNode;
  children: React.ReactNode;
  startCollapsed?: boolean;
  disableCollapse?: boolean;
  position?: 'before' | 'after';
}

const CollapseSection = memo(
  ({ header, children, startCollapsed = false, disableCollapse = false, position = 'after' }: CollapseSectionProps) => {
    const [collapsed, setCollapsed] = useState(startCollapsed);

    const toggleCollapse = useCallback(() => {
      if (disableCollapse) {
        return;
      }
      setCollapsed(!collapsed);
    }, [collapsed, disableCollapse]);

    const collapseButton = useMemo(
      () => (
        <StyledArrowIconWrapper collapsed={collapsed}>
          <KeyboardArrowDownIcon />
        </StyledArrowIconWrapper>
      ),
      [collapsed]
    );

    return (
      <>
        <StyledHeader onClick={toggleCollapse}>
          {position === 'before' ? collapseButton : null}
          {header}
          {position === 'after' ? collapseButton : null}
        </StyledHeader>
        <Collapse in={!collapsed}>{children}</Collapse>
      </>
    );
  }
);

CollapseSection.displayName = 'CollapseSection';

export default CollapseSection;
