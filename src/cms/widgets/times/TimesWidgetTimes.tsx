import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { arrayMoveImmutable } from '../../../util/array.util';
import TimesWidgetTime from './TimesWidgetTime';

import type { DragEndEvent } from '@dnd-kit/core';
import type { FC } from 'react';
import type { TimesTime } from '../../../interface';

const StyledDayTimeLineTimes = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-left: 40px;
`;

interface TimesWidgetTimesProps {
  times?: TimesTime[];
  onChange: (times: TimesTime[]) => void;
}

const TimesWidgetTimes: FC<TimesWidgetTimesProps> = ({ times: rawTimes = [], onChange }) => {
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

  const handleChange = useCallback(
    (newTime: TimesTime) => {
      const index = internalValue.findIndex((t) => t.id === newTime.id);
      if (index < 0) {
        return;
      }

      const newTimes = [...internalValue];
      newTimes[index] = newTime;
      setInternalValue(newTimes);
      onChange(newTimes);
    },
    [onChange, internalValue]
  );

  const handleDelete = useCallback(
    (newTime: TimesTime) => {
      const index = internalValue.findIndex((t) => t.id === newTime.id);
      if (index < 0) {
        return;
      }

      const newTimes = [...internalValue];
      newTimes.splice(index, 1);
      setInternalValue(newTimes);
      onChange(newTimes);
    },
    [onChange, internalValue]
  );

  const handleAdd = useCallback(() => {
    const newTimes = [...internalValue];
    newTimes.push({ id: uuid() });
    setInternalValue(newTimes);
    onChange(newTimes);
  }, [onChange, internalValue]);

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = internalValue.findIndex((t) => t.id === active.id);
      const newIndex = internalValue.findIndex((t) => t.id === over.id);

      console.log('[TIMES] oldIndex', oldIndex, 'active.id', active.id, 'newIndex', newIndex, 'over.id', over.id);

      // Update value
      const newTimes = arrayMoveImmutable(internalValue, oldIndex, newIndex);
      setInternalValue(newTimes);
      onChange(newTimes);
    },
    [onChange, internalValue]
  );

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={internalValue}>
          {internalValue.length > 0 ? (
            <StyledDayTimeLineTimes>
              {internalValue?.map((time) => (
                <TimesWidgetTime key={time.id} time={time} onChange={handleChange} onDelete={handleDelete} />
              ))}
            </StyledDayTimeLineTimes>
          ) : null}
        </SortableContext>
      </DndContext>
      <Button onClick={handleAdd} sx={{ ml: 5 }}>
        <AddIcon />
        <Box>Add Time</Box>
      </Button>
    </>
  );
};

export default TimesWidgetTimes;
