'use client';

import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useId } from 'react';

import { AdminSectionCard, AdminSortableAccordionRepeaterCard } from '../../components/AdminCards';
import { AdminImagePathField } from '../../components/AdminImagePathField';
import { createHomepageSlideFieldKey, parseHomepageFieldKey, type HomepageFieldKey } from './fieldKeys';

import type { HomepageDraft, HomepageSlideDraft } from '../../content/writableComplexContent';

const EMPTY_HOMEPAGE_SLIDE: HomepageSlideDraft = {
  image: '',
  title: ''
};

interface HomepageSlidesEditorProps {
  activeFieldKey?: HomepageFieldKey;
  expandedIndexes: number[];
  onChange: (value: HomepageDraft) => void;
  onExpandedEntered: (index: number) => void;
  onSelectSlideImage: (index: number) => void;
  onToggleExpanded: (index: number, expanded: boolean) => void;
  registerField: (fieldKey: HomepageFieldKey) => (element: HTMLElement | null) => void;
  value: HomepageDraft;
}

export function HomepageSlidesEditor({
  activeFieldKey,
  expandedIndexes,
  onChange,
  onExpandedEntered,
  onSelectSlideImage,
  onToggleExpanded,
  registerField,
  value
}: HomepageSlidesEditorProps) {
  const slideIdPrefix = useId();
  const sortableSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const slideSortableIds = value.slides.map((_, index) => `${slideIdPrefix}-slide-${index}`);
  const activeSlideIndex = activeFieldKey
    ? parseHomepageFieldKey(activeFieldKey)?.tab === 'slides'
      ? (parseHomepageFieldKey(activeFieldKey)?.index ?? null)
      : null
    : null;

  function updateHomepageSlide(index: number, nextValue: Partial<HomepageSlideDraft>) {
    const slides = value.slides.map((slide, slideIndex) => (slideIndex === index ? { ...slide, ...nextValue } : slide));
    onChange({ ...value, slides });
  }

  function moveHomepageSlide(activeId: string, overId: string) {
    const activeIndex = value.slides.findIndex((_, index) => `${slideIdPrefix}-slide-${index}` === activeId);
    const overIndex = value.slides.findIndex((_, index) => `${slideIdPrefix}-slide-${index}` === overId);

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
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={() => onChange({ ...value, slides: [...value.slides, { ...EMPTY_HOMEPAGE_SLIDE }] })}
        >
          Add slide
        </Button>
      }
    >
      <DndContext collisionDetection={closestCenter} onDragEnd={handleSlidesDragEnd} sensors={sortableSensors}>
        <SortableContext items={slideSortableIds} strategy={verticalListSortingStrategy}>
          <Stack spacing={2}>
            {value.slides.map((slide, index) => {
              const slideId = slideSortableIds[index];
              const imageAlt = slide.title || `Homepage slide ${index + 1}`;
              const hasImage = slide.image.trim().length > 0;

              return (
                <AdminSortableAccordionRepeaterCard
                  active={activeSlideIndex === index}
                  key={slideId}
                  expanded={expandedIndexes.includes(index)}
                  id={slideId}
                  onExpandedChange={(expanded) => onToggleExpanded(index, expanded)}
                  onExpandedEntered={() => onExpandedEntered(index)}
                  onRemove={() =>
                    onChange({ ...value, slides: value.slides.filter((_, slideIndex) => slideIndex !== index) })
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
                      inputRef={registerField(createHomepageSlideFieldKey(index, 'title'))}
                      value={slide.title}
                      onChange={(event) => updateHomepageSlide(index, { title: event.target.value })}
                      fullWidth
                    />
                    <AdminImagePathField
                      actionButtonRef={registerField(createHomepageSlideFieldKey(index, 'image'))}
                      onSelectImage={() => onSelectSlideImage(index)}
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
