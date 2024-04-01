import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { arrayMoveImmutable } from '../../../util/array.util';
import TimesWidgetTimeNote from './TimesWidgetTimeNote';

import type { DragEndEvent } from '@dnd-kit/core';
import type { FC } from 'react';
import type { TimesTimeNote } from '../../../interface';

const StyledDayTimeLineTimeNotes = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-left: 28px;
  width: calc(100% - 28px);
`;

interface TimesWidgetTimeNotesProps {
  times?: TimesTimeNote[];
  onChange: (times: TimesTimeNote[]) => void;
}

const TimesWidgetTimeNotes: FC<TimesWidgetTimeNotesProps> = ({ times: rawTimes = [], onChange }) => {
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
    (newTime: TimesTimeNote) => {
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
    (newTime: TimesTimeNote) => {
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
    newTimes.push({ id: uuid(), note: '' });
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
            <StyledDayTimeLineTimeNotes>
              {internalValue?.map((note) => (
                <TimesWidgetTimeNote key={note.id} note={note} onChange={handleChange} onDelete={handleDelete} />
              ))}
            </StyledDayTimeLineTimeNotes>
          ) : null}
        </SortableContext>
      </DndContext>
      <Button onClick={handleAdd} sx={{ ml: '28px' }}>
        <AddIcon />
        <Box>Add Note</Box>
      </Button>
    </>
  );
};

export default TimesWidgetTimeNotes;
