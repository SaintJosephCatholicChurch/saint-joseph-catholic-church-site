import { useSortable } from '@dnd-kit/sortable';
import Tab from '@mui/material/Tab';
import { CSS } from '@dnd-kit/utilities';
import { useCallback, useMemo } from 'react';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { styled, useTheme } from '@mui/material/styles';

import type { Times } from '@/interface';
import type { FC } from 'react';

const StyledTabLabel = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  padding-left: 16px;
`;

const StyledDragHandle = styled('div')`
  cursor: grab;
`;

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

export interface SortableTabProps {
  timeSchedule: Times;
  index: number;
  onClick: (index: number) => void;
}

const SortableTab: FC<SortableTabProps> = ({ timeSchedule, index, onClick }) => {
  const sortableProps = useMemo(() => ({ id: timeSchedule.id }), [timeSchedule]);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable(sortableProps);

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition
    }),
    [transform, transition]
  );

  const theme = useTheme();

  const handleClick = useCallback(() => {
    onClick(index);
  }, [index, onClick]);

  return (
    <StyledTabLabel ref={setNodeRef} style={style} {...attributes}>
      <StyledDragHandle ref={setActivatorNodeRef} {...listeners} style={{ color: theme.palette.text.primary }}>
        <DragHandleIcon />
      </StyledDragHandle>
      <Tab
        label={timeSchedule.name}
        {...a11yProps(index)}
        sx={{
          color: '#414141',
          alignItems: 'flex-start',
          padding: '32px',
          fontSize: '16px',
          fontWeight: 400,
          fontFamily: "'Oswald', Helvetica, Arial, sans-serif",
          letterSpacing: 0,
          minHeight: '80px',
          '&.Mui-selected': {
            color: '#414141',
            backgroundColor: '#ffffff'
          },
          paddingLeft: '16px',
          flexGrow: 1
        }}
        onClick={handleClick}
      />
    </StyledTabLabel>
  );
};

export default SortableTab;
