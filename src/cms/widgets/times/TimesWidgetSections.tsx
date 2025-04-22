import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { arrayMoveImmutable } from '../../../util/array.util';
import TimesWidgetSection from './TimesWidgetSection';

import type { DragEndEvent } from '@dnd-kit/core';
import type { FC } from 'react';
import type { TimesNoteSection, TimesSection } from '../../../interface';

const StyledSectionTimeLines = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledAddButtonWrapper = styled('div')`
  display: flex;
`;

interface TimesWidgetSectionsProps {
  sections?: (TimesSection | TimesNoteSection)[];
  onChange: (sections: (TimesSection | TimesNoteSection)[]) => void;
}

const TimesWidgetSections: FC<TimesWidgetSectionsProps> = ({ sections: rawSections = [], onChange }) => {
  const hasMissingIds = Boolean(rawSections.find((i) => !i.id));
  const sections = useMemo(
    () =>
      rawSections.map((t) => ({
        ...t,
        id: t.id ?? uuid()
      })),
    [rawSections]
  );

  useEffect(() => {
    if (hasMissingIds) {
      onChange(sections);
    }
  }, [sections, hasMissingIds, onChange]);

  const [internalValue, setInternalValue] = useState(sections);

  const handleChange = useCallback(
    (newSection: TimesSection) => {
      const index = internalValue.findIndex((t) => t.id === newSection.id);
      if (index < 0) {
        return;
      }

      const newSections = [...internalValue];
      newSections[index] = newSection;
      setInternalValue(newSections);
      onChange(newSections);
    },
    [onChange, internalValue]
  );

  const handleDelete = useCallback(
    (newSection: TimesSection) => {
      const index = internalValue.findIndex((t) => t.id === newSection.id);
      if (index < 0) {
        return;
      }

      const newSections = [...internalValue];
      newSections.splice(index, 1);
      setInternalValue(newSections);
      onChange(newSections);
    },
    [onChange, internalValue]
  );

  const handleAdd = useCallback(() => {
    const newSections = [...internalValue];
    newSections.push({ id: uuid(), name: 'New Section' });
    setInternalValue(newSections);
    onChange(newSections);
  }, [onChange, internalValue]);

  const handleAddNote = useCallback(() => {
    const newSections = [...internalValue];
    newSections.push({ id: uuid(), note: 'New Note' });
    setInternalValue(newSections);
    onChange(newSections);
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
            <StyledSectionTimeLines>
              {internalValue?.map((section) => (
                <TimesWidgetSection
                  key={section.id}
                  section={section}
                  onChange={handleChange}
                  onDelete={handleDelete}
                />
              ))}
            </StyledSectionTimeLines>
          ) : null}
        </SortableContext>
      </DndContext>
      <StyledAddButtonWrapper>
        <Button onClick={handleAdd}>
          <AddIcon />
          <div>Add Section</div>
        </Button>
        <Button onClick={handleAddNote}>
          <AddIcon />
          <div>Add Note</div>
        </Button>
      </StyledAddButtonWrapper>
    </>
  );
};

export default TimesWidgetSections;
