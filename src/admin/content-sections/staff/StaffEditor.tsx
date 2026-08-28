'use client';

import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AdminSortableAccordionRepeaterCard } from '../../components/AdminCards';
import { AdminImagePathField } from '../../components/AdminImagePathField';
import { createDraftClientId, type StaffEntryDraft } from '../../content/writableComplexContent';
import { createStaffFieldKey, parseStaffFieldKey, type StaffFieldKey } from './fieldKeys';

import type { DragEndEvent } from '@dnd-kit/core';

interface StaffEditorProps {
  activeFieldKey?: StaffFieldKey;
  expandedClientIds: string[];
  onChange: (value: StaffEntryDraft[]) => void;
  onExpandedEntered: (clientId: string) => void;
  onFocusFieldKey: (fieldKey: StaffFieldKey | null) => void;
  onSelectImage: (clientId: string) => void;
  onToggleExpanded: (clientId: string, expanded: boolean) => void;
  registerField: (fieldKey: StaffFieldKey) => (element: HTMLElement | null) => void;
  value: StaffEntryDraft[];
}

function createEmptyStaffEntry(): StaffEntryDraft {
  return {
    clientId: createDraftClientId(),
    name: '',
    picture: '',
    title: ''
  };
}

export function StaffEditor({
  activeFieldKey,
  expandedClientIds,
  onChange,
  onExpandedEntered,
  onFocusFieldKey,
  onSelectImage,
  onToggleExpanded,
  registerField,
  value
}: StaffEditorProps) {
  const sortableSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const staffSortableIds = value.map((entry) => entry.clientId);
  const activeStaffClientId = activeFieldKey ? (parseStaffFieldKey(activeFieldKey)?.clientId ?? null) : null;

  function updateStaffEntry(clientId: string, nextValue: Partial<StaffEntryDraft>) {
    onChange(value.map((entry) => (entry.clientId === clientId ? { ...entry, ...nextValue } : entry)));
  }

  function moveStaffEntry(activeId: string, overId: string) {
    const activeIndex = value.findIndex((entry) => entry.clientId === activeId);
    const overIndex = value.findIndex((entry) => entry.clientId === overId);

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
        onClick={() => onChange([...value, createEmptyStaffEntry()])}
        sx={{ alignSelf: 'flex-start' }}
      >
        Add staff entry
      </Button>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleStaffDragEnd} sensors={sortableSensors}>
        <SortableContext items={staffSortableIds} strategy={verticalListSortingStrategy}>
          <Stack spacing={2}>
            {value.map((entry, index) => {
              const imageAlt = entry.name || `Staff entry ${index + 1}`;
              const hasImage = entry.picture.trim().length > 0;
              const nameFieldKey = createStaffFieldKey(entry.clientId, 'name');
              const titleFieldKey = createStaffFieldKey(entry.clientId, 'title');
              const pictureFieldKey = createStaffFieldKey(entry.clientId, 'picture');

              return (
                <AdminSortableAccordionRepeaterCard
                  key={entry.clientId}
                  active={activeStaffClientId === entry.clientId}
                  expanded={expandedClientIds.includes(entry.clientId)}
                  id={entry.clientId}
                  onExpandedChange={(expanded) => onToggleExpanded(entry.clientId, expanded)}
                  onExpandedEntered={() => onExpandedEntered(entry.clientId)}
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
                  onRemove={() => onChange(value.filter((item) => item.clientId !== entry.clientId))}
                  removeButtonLabel="Remove staff entry"
                >
                  <Stack spacing={2} sx={{ pt: 1 }}>
                    <TextField
                      label="Name"
                      inputRef={registerField(nameFieldKey)}
                      value={entry.name}
                      onFocus={() => onFocusFieldKey(nameFieldKey)}
                      onChange={(event) => updateStaffEntry(entry.clientId, { name: event.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="Title"
                      inputRef={registerField(titleFieldKey)}
                      value={entry.title}
                      onFocus={() => onFocusFieldKey(titleFieldKey)}
                      onChange={(event) => updateStaffEntry(entry.clientId, { title: event.target.value })}
                      fullWidth
                    />
                    <AdminImagePathField
                      actionButtonRef={registerField(pictureFieldKey)}
                      onButtonFocus={() => onFocusFieldKey(pictureFieldKey)}
                      onSelectImage={() => onSelectImage(entry.clientId)}
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
