import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { arrayMoveImmutable } from '../../../util/array.util';
import TimesWidgetDay from './TimesWidgetDay';

import type { DragEndEvent } from '@dnd-kit/core';
import type { FC } from 'react';
import type { TimesDay } from '../../../interface';

const StyledDayTimeLines = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledAddButtonWrapper = styled('div')`
  display: flex;
`;

interface TimesWidgetDaysProps {
  days?: TimesDay[];
  onChange: (days: TimesDay[]) => void;
}

const TimesWidgetDays: FC<TimesWidgetDaysProps> = ({ days: rawDays = [], onChange }) => {
  const hasMissingIds = Boolean(rawDays.find((i) => !i.id));

  const days = useMemo(
    () =>
      rawDays.map((t) => ({
        ...t,
        id: t.id ?? uuid()
      })),
    [rawDays]
  );

  useEffect(() => {
    if (hasMissingIds) {
      onChange(days);
    }
  }, [days, hasMissingIds, onChange]);

  const [internalValue, setInternalValue] = useState(days);

  const handleChange = useCallback(
    (newDay: TimesDay) => {
      const index = internalValue.findIndex((t) => t.id === newDay.id);
      if (index < 0) {
        return;
      }

      const newDays = [...internalValue];
      newDays[index] = newDay;
      setInternalValue(newDays);
      onChange(newDays);
    },
    [onChange, internalValue]
  );

  const handleDelete = useCallback(
    (newDay: TimesDay) => {
      const index = internalValue.findIndex((t) => t.id === newDay.id);
      if (index < 0) {
        return;
      }

      const newDays = [...internalValue];
      newDays.splice(index, 1);
      setInternalValue(newDays);
      onChange(newDays);
    },
    [onChange, internalValue]
  );

  const handleAdd = useCallback(() => {
    const newDays = [...internalValue];
    newDays.push({ id: uuid(), day: 'New Day' });
    setInternalValue(newDays);
    onChange(newDays);
  }, [onChange, internalValue]);

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = internalValue.findIndex((t) => t.id === active.id);
      const newIndex = internalValue.findIndex((t) => t.id === over.id);

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
            <StyledDayTimeLines>
              {internalValue?.map((day) => (
                <TimesWidgetDay key={day.id} day={day} onChange={handleChange} onDelete={handleDelete} />
              ))}
            </StyledDayTimeLines>
          ) : null}
        </SortableContext>
      </DndContext>
      <StyledAddButtonWrapper>
        <Button onClick={handleAdd} sx={{ ml: '30px' }}>
          <AddIcon />
          <div>Add Day / Line</div>
        </Button>
      </StyledAddButtonWrapper>
    </>
  );
};

export default TimesWidgetDays;
