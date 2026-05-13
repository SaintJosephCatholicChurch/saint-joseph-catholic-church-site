'use client';

import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useId } from 'react';

import { AdminSortableAccordionRepeaterCard } from '../../components/AdminCards';
import { AdminImagePathField } from '../../components/AdminImagePathField';
import { createStaffFieldKey, parseStaffFieldKey, type StaffFieldKey } from './fieldKeys';

import type { StaffEntryDraft } from '../../content/writableComplexContent';
import type { DragEndEvent } from '@dnd-kit/core';

interface StaffEditorProps {
  activeFieldKey?: StaffFieldKey;
  expandedIndexes: number[];
  onChange: (value: StaffEntryDraft[]) => void;
  onExpandedEntered: (index: number) => void;
  onFocusFieldKey: (fieldKey: StaffFieldKey | null) => void;
  onSelectImage: (index: number) => void;
  onToggleExpanded: (index: number, expanded: boolean) => void;
  registerField: (fieldKey: StaffFieldKey) => (element: HTMLElement | null) => void;
  value: StaffEntryDraft[];
}

const EMPTY_STAFF_ENTRY: StaffEntryDraft = {
  name: '',
  picture: '',
  title: ''
};

export function StaffEditor({
  activeFieldKey,
  expandedIndexes,
  onChange,
  onExpandedEntered,
  onFocusFieldKey,
  onSelectImage,
  onToggleExpanded,
  registerField,
  value
}: StaffEditorProps) {
  const staffIdPrefix = useId();
  const sortableSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const staffSortableIds = value.map((_, index) => `${staffIdPrefix}-staff-${index}`);
  const activeStaffIndex = activeFieldKey ? (parseStaffFieldKey(activeFieldKey)?.index ?? null) : null;

  function updateStaffEntry(index: number, nextValue: Partial<StaffEntryDraft>) {
    onChange(value.map((entry, entryIndex) => (entryIndex === index ? { ...entry, ...nextValue } : entry)));
  }

  function moveStaffEntry(activeId: string, overId: string) {
    const activeIndex = value.findIndex((_, index) => `${staffIdPrefix}-staff-${index}` === activeId);
    const overIndex = value.findIndex((_, index) => `${staffIdPrefix}-staff-${index}` === overId);

    if (activeIndex < 0 || overIndex < 0 || activeIndex === overIndex) {
      return;
    }

    const nextValue = [...value];
    const [movedEntry] = nextValue.splice(activeIndex, 1);
    nextValue.splice(overIndex, 0, movedEntry);
    onChange(nextValue);
  }

  function handleStaffDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    moveStaffEntry(String(active.id), String(over.id));
  }

  return (
    <Stack spacing={2}>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => onChange([...value, { ...EMPTY_STAFF_ENTRY }])}
        sx={{ alignSelf: 'flex-start' }}
      >
        Add staff entry
      </Button>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleStaffDragEnd} sensors={sortableSensors}>
        <SortableContext items={staffSortableIds} strategy={verticalListSortingStrategy}>
          <Stack spacing={2}>
            {value.map((entry, index) => {
              const entryId = staffSortableIds[index];
              const imageAlt = entry.name || `Staff entry ${index + 1}`;
              const hasImage = entry.picture.trim().length > 0;
              const nameFieldKey = createStaffFieldKey(index, 'name');
              const titleFieldKey = createStaffFieldKey(index, 'title');
              const pictureFieldKey = createStaffFieldKey(index, 'picture');

              return (
                <AdminSortableAccordionRepeaterCard
                  key={entryId}
                  active={activeStaffIndex === index}
                  expanded={expandedIndexes.includes(index)}
                  id={entryId}
                  onExpandedChange={(expanded) => onToggleExpanded(index, expanded)}
                  onExpandedEntered={() => onExpandedEntered(index)}
                  title={entry.name.trim() || `Staff ${index + 1}`}
                  summary={entry.title.trim() || (hasImage ? entry.picture : 'No title or image selected yet.')}
                  preview={
                    hasImage ? (
                      <img
                        alt={imageAlt}
                        src={entry.picture}
                        style={{ display: 'block', height: '100%', objectFit: 'cover', width: '100%' }}
                      />
                    ) : (
                      <Typography sx={{ color: '#7a5d50', px: 1, textAlign: 'center' }} variant="caption">
                        No image
                      </Typography>
                    )
                  }
                  onRemove={() => onChange(value.filter((_, entryIndex) => entryIndex !== index))}
                  removeButtonLabel="Remove staff entry"
                >
                  <Stack spacing={2} sx={{ pt: 1 }}>
                    <TextField
                      label="Name"
                      inputRef={registerField(nameFieldKey)}
                      value={entry.name}
                      onFocus={() => onFocusFieldKey(nameFieldKey)}
                      onChange={(event) => updateStaffEntry(index, { name: event.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="Title"
                      inputRef={registerField(titleFieldKey)}
                      value={entry.title}
                      onFocus={() => onFocusFieldKey(titleFieldKey)}
                      onChange={(event) => updateStaffEntry(index, { title: event.target.value })}
                      fullWidth
                    />
                    <AdminImagePathField
                      actionButtonRef={registerField(pictureFieldKey)}
                      onButtonFocus={() => onFocusFieldKey(pictureFieldKey)}
                      onSelectImage={() => onSelectImage(index)}
                      previewAlt={imageAlt}
                      value={entry.picture}
                    />
                  </Stack>
                </AdminSortableAccordionRepeaterCard>
              );
            })}
          </Stack>
        </SortableContext>
      </DndContext>
    </Stack>
  );
}
