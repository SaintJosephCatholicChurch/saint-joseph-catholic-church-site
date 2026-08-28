'use client';

import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AdminSectionCard, AdminSortableAccordionRepeaterCard } from '../../components/AdminCards';
import { AdminImagePathField } from '../../components/AdminImagePathField';
import { createDraftClientId, type HomepageDraft, type HomepageSlideDraft } from '../../content/writableComplexContent';
import { createHomepageSlideFieldKey, parseHomepageFieldKey, type HomepageFieldKey } from './fieldKeys';

interface HomepageSlidesEditorProps {
  activeFieldKey?: HomepageFieldKey;
  expandedClientIds: string[];
  onChange: (value: HomepageDraft) => void;
  onExpandedEntered: (clientId: string) => void;
  onSelectSlideImage: (clientId: string) => void;
  onToggleExpanded: (clientId: string, expanded: boolean) => void;
  registerField: (fieldKey: HomepageFieldKey) => (element: HTMLElement | null) => void;
  value: HomepageDraft;
}

function createEmptyHomepageSlide(): HomepageSlideDraft {
  return {
    clientId: createDraftClientId(),
    image: '',
    title: ''
  };
}

export function HomepageSlidesEditor({
  activeFieldKey,
  expandedClientIds,
  onChange,
  onExpandedEntered,
  onSelectSlideImage,
  onToggleExpanded,
  registerField,
  value
}: HomepageSlidesEditorProps) {
  const sortableSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const slideSortableIds = value.slides.map((slide) => slide.clientId);
  const parsedActiveFieldKey = activeFieldKey ? parseHomepageFieldKey(activeFieldKey) : null;
  const activeSlideClientId = parsedActiveFieldKey?.tab === 'slides' ? parsedActiveFieldKey.clientId : null;

  function updateHomepageSlide(clientId: string, nextValue: Partial<HomepageSlideDraft>) {
    const slides = value.slides.map((slide) => (slide.clientId === clientId ? { ...slide, ...nextValue } : slide));
    onChange({ ...value, slides });
  }

  function moveHomepageSlide(activeId: string, overId: string) {
    const activeIndex = value.slides.findIndex((slide) => slide.clientId === activeId);
    const overIndex = value.slides.findIndex((slide) => slide.clientId === overId);

    if (activeIndex < 0 || overIndex < 0 || activeIndex === overIndex) {
      return;
    }

    const nextSlides = [...value.slides];
    const [movedSlide] = nextSlides.splice(activeIndex, 1);
    nextSlides.splice(overIndex, 0, movedSlide);
    onChange({ ...value, slides: nextSlides });
  }

  function handleSlidesDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    moveHomepageSlide(String(active.id), String(over.id));
  }

  return (
    <AdminSectionCard
      title="Slides"
      headerActions={
        <Button startIcon={<AddIcon />} variant="outlined" onClick={() => onChange({ ...value, slides: [...value.slides, createEmptyHomepageSlide()] })}>
          Add slide
        </Button>
      }
    >
      <DndContext collisionDetection={closestCenter} onDragEnd={handleSlidesDragEnd} sensors={sortableSensors}>
        <SortableContext items={slideSortableIds} strategy={verticalListSortingStrategy}>
          <Stack spacing={2}>
            {value.slides.map((slide, index) => {
              const imageAlt = slide.title || `Homepage slide ${index + 1}`;
              const hasImage = slide.image.trim().length > 0;

              return (
                <AdminSortableAccordionRepeaterCard
                  active={activeSlideClientId === slide.clientId}
                  key={slide.clientId}
                  expanded={expandedClientIds.includes(slide.clientId)}
                  id={slide.clientId}
                  onExpandedChange={(expanded) => onToggleExpanded(slide.clientId, expanded)}
                  onExpandedEntered={() => onExpandedEntered(slide.clientId)}
                  onRemove={() =>
                    onChange({ ...value, slides: value.slides.filter((entry) => entry.clientId !== slide.clientId) })
                  }
                  removeButtonLabel="Remove slide"
                  title={`Slide ${index + 1}`}
                  summary={slide.title || (hasImage ? slide.image : 'No text or image selected yet.')}
                  preview={
                    hasImage ? (
                      <img
                        alt={imageAlt}
                        src={slide.image}
                        style={{ display: 'block', height: '100%', objectFit: 'cover', width: '100%' }}
                      />
                    ) : (
                      <Typography sx={{ color: '#7a5d50', px: 1, textAlign: 'center' }} variant="caption">
                        No image
                      </Typography>
                    )
                  }
                >
                  <Stack direction="column" spacing={2}>
                    <TextField
                      label="Text"
                      inputRef={registerField(createHomepageSlideFieldKey(slide.clientId, 'title'))}
                      value={slide.title}
                      onChange={(event) => updateHomepageSlide(slide.clientId, { title: event.target.value })}
                      fullWidth
                    />
                    <AdminImagePathField
                      actionButtonRef={registerField(createHomepageSlideFieldKey(slide.clientId, 'image'))}
                      onSelectImage={() => onSelectSlideImage(slide.clientId)}
                      previewAlt={imageAlt}
                      value={slide.image}
                    />
                  </Stack>
                </AdminSortableAccordionRepeaterCard>
              );
            })}
          </Stack>
        </SortableContext>
      </DndContext>
    </AdminSectionCard>
  );
}
