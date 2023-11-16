import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

import Container from '../../../components/layout/Container';
import { arrayMoveImmutable } from '../../../util/array.util';
import ScheduleTabChangeEvent from '../../../util/events/ScheduleTabChangeEvent';
import { useWindowEvent } from '../../../util/window.util';
import SortableCategoryTab from './SortableCategoryTab';
import ScheduleTabPanel from './TimesWidgetTabPanelWidget';

import type { DragEndEvent } from '@dnd-kit/core';
import type { Times } from '../../../interface';

const StyledScheduleWidget = styled('div')`
  border: 1px solid rgb(223, 223, 227);
  background-color: rgba(241, 241, 241, 0.75);
  background-repeat: repeat;
  background-position: center top;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledScheduleWidgetContent = styled('div')`
  display: grid;
  grid-template-columns: 2fr 5fr;
  width: 100%;
`;

const StyledTabPanels = styled('div')`
  width: 100%;
  background-color: #ffffff;
  position: relative;
`;

interface ScheduleProps {
  times: Times[];
  onChange: (times: Times[]) => void;
}

const Schedule = ({ times: rawTimes, onChange }: ScheduleProps) => {
  const [value, setValue] = useState(0);
  const hasMissingIds = Boolean(rawTimes.find((i) => !i.id));

  const times = useMemo(
    () =>
      rawTimes.map((t) => ({
        ...t,
        id: t.id ?? uuid()
      })),
    [rawTimes]
  );

  useEffect(() => {
    if (hasMissingIds) {
      onChange(times);
    }
  }, [times, hasMissingIds, onChange]);

  const [internalValue, setInternalValue] = useState(times);

  const handleTabClick = useCallback((newValue: number) => {
    setValue(newValue);
    window.dispatchEvent(new ScheduleTabChangeEvent(newValue));
  }, []);

  const handleTabChangeEvent = useCallback((event: ScheduleTabChangeEvent) => {
    setValue(event.detail);
  }, []);

  useWindowEvent('scheduleTabChange', handleTabChangeEvent);

  const handleDataChange = useCallback(
    (timesValue: Times, index: number) => (newData: Partial<Times>) => {
      console.log('handleDataChange', timesValue, index)
      const newTimes = [...internalValue];
      newTimes[index] = { ...timesValue, ...newData };
      setInternalValue(newTimes);
      onChange(newTimes);
    },
    [onChange, internalValue]
  );

  const handleAddTimes = useCallback(() => {
    const newTimes = [...internalValue];
    newTimes.push({ id: uuid(), name: 'New Times', sections: [] });
    setInternalValue(newTimes);
    onChange(newTimes);
  }, [onChange, internalValue]);

  const handleRemoveTimes = useCallback(
    (index: number) => () => {
      const newTimes = [...internalValue];
      newTimes.splice(index, 1);
      setInternalValue(newTimes);
      onChange(newTimes);
    },
    [onChange, internalValue]
  );

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = internalValue.findIndex((t) => t.id === active.id);
      const newIndex = internalValue.findIndex((t) => t.id === over.id);

      console.log('oldIndex', oldIndex, 'active.id', active.id, 'newIndex', newIndex, 'over.id', over.id);

      // Update value
      const newTimes = arrayMoveImmutable(internalValue, oldIndex, newIndex);
      setInternalValue(newTimes);
      onChange(newTimes);
    },
    [onChange, internalValue]
  );

  return (
    <StyledScheduleWidget>
      <Container disablePadding>
        <StyledScheduleWidgetContent>
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={internalValue}>
              <Tabs
                orientation="vertical"
                variant="standard"
                value={value}
                aria-label="Vertical tabs example"
                scrollButtons={false}
                sx={{
                  backgroundColor: 'rgba(241, 241, 241, 0.75)',
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#8D6D26',
                    width: '4px'
                  }
                }}
              >
                {internalValue.map((timeSchedule, index) => (
                  <SortableCategoryTab
                    key={`time-schedule-${timeSchedule.id}`}
                    timeSchedule={timeSchedule}
                    index={index}
                    onClick={handleTabClick}
                  />
                ))}
                <Button
                  onClick={handleAddTimes}
                  sx={{
                    padding: '28px 32px',
                    fontSize: '16px',
                    fontWeight: 400,
                    fontFamily: "'Oswald', Helvetica, Arial, sans-serif",
                    letterSpacing: 0,
                    minHeight: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                  }}
                >
                  <AddIcon />
                  <Box>Add Category</Box>
                </Button>
              </Tabs>
            </SortableContext>
          </DndContext>
          <StyledTabPanels>
            {internalValue.map((timeSchedule, index) => (
              <ScheduleTabPanel
                key={`schedule-tab-${index}`}
                value={value}
                index={index}
                times={timeSchedule}
                onChange={handleDataChange(timeSchedule, index)}
                onDelete={handleRemoveTimes(index)}
              />
            ))}
          </StyledTabPanels>
        </StyledScheduleWidgetContent>
      </Container>
    </StyledScheduleWidget>
  );
};

export default Schedule;
