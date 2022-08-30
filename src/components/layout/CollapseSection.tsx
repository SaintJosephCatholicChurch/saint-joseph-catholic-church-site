/* eslint-disable react/display-name */
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { SxProps, Theme } from '@mui/material/styles';
import { memo, useCallback, useMemo, useState } from 'react';

interface CollapseSectionProps {
  header: React.ReactNode;
  children: React.ReactNode;
  startCollapsed?: boolean;
  disableCollapse?: boolean;
  position?: 'before' | 'after';
  sx?: SxProps<Theme>;
}

const CollapseSection = memo(
  ({
    header,
    children,
    startCollapsed = false,
    disableCollapse = false,
    position = 'after',
    sx = {}
  }: CollapseSectionProps) => {
    const [collapsed, setCollapsed] = useState(startCollapsed);

    const toggleCollapse = useCallback(() => {
      if (disableCollapse) {
        return;
      }
      setCollapsed(!collapsed);
    }, [collapsed, disableCollapse]);

    const collapseButton = useMemo(
      () => (
        <Box
          sx={{
            transition: 'transform 333ms ease-out',
            transform: `rotate(${collapsed ? '-90deg' : '0deg'});`,
            width: 24,
            height: 24
          }}
        >
          <KeyboardArrowDownIcon />
        </Box>
      ),
      [collapsed]
    );

    return (
      <Box sx={{ ...sx }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 0.5 }} onClick={toggleCollapse}>
          {position === 'before' ? collapseButton : null}
          {header}
          {position === 'after' ? collapseButton : null}
        </Box>
        <Collapse in={!collapsed}>{children}</Collapse>
      </Box>
    );
  }
);

export default CollapseSection;
