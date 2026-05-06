'use client';

import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Fragment, useEffect, useId, useState, type MouseEvent } from 'react';

import ScheduleWidget from '../cms/widgets/times/TimesWidgetControl';
import { AdminImagePathField } from './AdminImagePathField';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { HomepagePreview } from './HomepagePreview';
import {
  COMPLEX_WRITABLE_SECTIONS,
  createComplexDraft,
  loadComplexContent,
  saveComplexSection,
  type ComplexContent,
  type ComplexDraft,
  type ComplexSectionId,
  type HomepageFeaturedDraft,
  type HomepageFeaturedLinkDraft,
  type HomepageFeaturedPageDraft,
  type HomepageSlideDraft,
  type StaffEntryDraft
} from './content/writableComplexContent';

import type { MediaAsset, MediaFolderId } from './content/writableBulletinsMediaContent';
import type { AdminRepoClient } from './services/adminTypes';

interface ComplexStructuredContentEditorProps {
  onSaved: () => Promise<void>;
  repoClient: AdminRepoClient;
  showIntroAlert?: boolean;
  visibleSections?: ComplexSectionId[];
}

interface ComplexEditorState {
  content: ComplexContent | null;
  draft: ComplexDraft | null;
  error: string | null;
  saveError: string | null;
  saveMessage: string | null;
  saveSectionId: ComplexSectionId | null;
  saveStatus: 'error' | 'idle' | 'saving' | 'success';
  status: 'error' | 'idle' | 'loading' | 'success';
}

const INITIAL_EDITOR_STATE: ComplexEditorState = {
  content: null,
  draft: null,
  error: null,
  saveError: null,
  saveMessage: null,
  saveSectionId: null,
  saveStatus: 'idle',
  status: 'idle'
};

const EMPTY_HOMEPAGE_SLIDE: HomepageSlideDraft = {
  image: '',
  title: ''
};

const EMPTY_FEATURED_LINK: HomepageFeaturedLinkDraft = {
  image: '',
  summary: '',
  title: '',
  type: 'featured_link',
  url: ''
};

const EMPTY_FEATURED_PAGE: HomepageFeaturedPageDraft = {
  image: '',
  pageSlug: '',
  pageTitle: '',
  summary: '',
  type: 'featured_page'
};

const EMPTY_STAFF_ENTRY: StaffEntryDraft = {
  name: '',
  picture: '',
  title: ''
};

type ImagePickerTarget =
  | { kind: 'homepage-featured'; index: number }
  | { kind: 'homepage-daily-readings-background' }
  | { kind: 'homepage-schedule-background' }
  | { kind: 'homepage-slide'; index: number }
  | { kind: 'staff'; index: number }
  | null;

type HomepageEditorTabId = 'featured' | 'hero' | 'sections' | 'slides';

function buildErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'The complex structured editor failed to load.';
}

function getSectionLabel(sectionId: ComplexSectionId) {
  switch (sectionId) {
    case 'homepage':
      return 'Homepage';
    case 'times':
      return 'Times';
    case 'staff':
      return 'Staff';
    default:
      return sectionId;
  }
}

function StructuredSectionCard({
  actions,
  children,
  description,
  headerActions,
  title
}: {
  actions?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
  headerActions: React.ReactNode;
  title: string;
}) {
  return (
    <Stack
      spacing={2}
      sx={{
        background: '#ffffff',
        border: '1px solid rgba(191, 48, 60, 0.12)',
        borderRadius: '4px',
        padding: { md: 2.5, xs: 2 }
      }}
    >
      <Stack direction={{ md: 'row', xs: 'column' }} spacing={1.5} alignItems="center" justifyContent="space-between">
        <div>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {description && <Typography sx={{ color: '#616169', lineHeight: 1.7, mt: 1 }}>{description}</Typography>}
        </div>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ alignSelf: { md: 'flex-start', xs: 'stretch' } }}>
          {headerActions}
        </Stack>
      </Stack>
      {children}
      {actions ? (
        <>
          <Divider />
          {actions}
        </>
      ) : null}
    </Stack>
  );
}

function RepeaterCard({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <Stack
      spacing={2}
      sx={{
        border: '1px solid rgba(191, 48, 60, 0.12)',
        borderRadius: '4px',
        padding: 2,
        background: '#fbfaf8'
      }}
    >
      <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
      {children}
    </Stack>
  );
}

function SortableAccordionRepeaterCard({
  children,
  defaultExpanded = false,
  dragHandleLabel,
  id,
  preview,
  summary,
  title
}: {
  children: React.ReactNode;
  defaultExpanded?: boolean;
  dragHandleLabel?: string;
  id: string;
  preview?: React.ReactNode;
  summary?: React.ReactNode;
  title: string;
}) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({ id });

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      ref={setNodeRef}
      sx={{
        '&::before': { display: 'none' },
        background: '#fbfaf8',
        border: '1px solid rgba(191, 48, 60, 0.12)',
        borderRadius: '4px',
        boxShadow: 'none',
        opacity: isDragging ? 0.92 : 1,
        overflow: 'hidden',
        transform: CSS.Transform.toString(transform),
        transition
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          '& .MuiAccordionSummary-content': { alignItems: 'center', margin: 0 },
          minHeight: 88,
          px: 2,
          py: 1.5
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, width: '100%' }}>
          <IconButton
            aria-label={dragHandleLabel || `Reorder ${title}`}
            edge="start"
            size="small"
            {...attributes}
            {...listeners}
            onClick={(event) => event.stopPropagation()}
            sx={{ color: '#7a5d50', cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <DragIndicatorIcon fontSize="small" />
          </IconButton>
          {preview ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                background: 'rgba(191, 48, 60, 0.04)',
                border: '1px solid rgba(191, 48, 60, 0.12)',
                borderRadius: '4px',
                flexShrink: 0,
                height: 56,
                overflow: 'hidden',
                width: 92
              }}
            >
              {preview}
            </Stack>
          ) : null}
          <Stack spacing={0.25} sx={{ minWidth: 0, maxWidth: '166px' }}>
            <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
            {summary ? (
              <Typography
                sx={{
                  color: '#6e5b53',
                  lineHeight: 1.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                variant="body2"
              >
                {summary}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
        <Stack spacing={2}>{children}</Stack>
      </AccordionDetails>
    </Accordion>
  );
}

function HomepageEditorGroup({
  actions,
  children,
  description,
  title
}: {
  actions?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <Stack
      spacing={2}
      sx={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(250,245,238,0.96))',
        border: '1px solid rgba(191, 48, 60, 0.12)',
        borderRadius: '4px',
        padding: 2
      }}
    >
      <div>
        <Stack
          direction={{ sm: 'row', xs: 'column' }}
          spacing={1.5}
          alignItems={{ sm: 'center', xs: 'stretch' }}
          justifyContent="space-between"
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {actions}
        </Stack>
        {description ? (
          <Typography sx={{ color: '#616169', lineHeight: 1.6, mt: 0.75 }}>{description}</Typography>
        ) : null}
      </div>
      {children}
    </Stack>
  );
}

export function ComplexStructuredContentEditor({
  onSaved,
  repoClient,
  showIntroAlert = true,
  visibleSections
}: ComplexStructuredContentEditorProps) {
  const [editorState, setEditorState] = useState<ComplexEditorState>(INITIAL_EDITOR_STATE);
  const [homepageTab, setHomepageTab] = useState<HomepageEditorTabId>('hero');
  const [featuredMenuAnchor, setFeaturedMenuAnchor] = useState<HTMLElement | null>(null);
  const [imagePickerTarget, setImagePickerTarget] = useState<ImagePickerTarget>(null);
  const slideIdPrefix = useId();
  const slideDragSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const visibleSectionIds = visibleSections || COMPLEX_WRITABLE_SECTIONS.map((section) => section.id);

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      setEditorState((currentState) => ({
        ...currentState,
        error: null,
        status: 'loading'
      }));

      try {
        const content = await loadComplexContent(repoClient);

        if (cancelled) {
          return;
        }

        setEditorState((currentState) => ({
          ...currentState,
          content,
          draft: createComplexDraft(content),
          error: null,
          status: 'success'
        }));
      } catch (error) {
        if (cancelled) {
          return;
        }

        setEditorState((currentState) => ({
          ...currentState,
          error: buildErrorMessage(error),
          status: 'error'
        }));
      }
    }

    void loadContent();

    return () => {
      cancelled = true;
    };
  }, [repoClient]);

  function updateDraft<TKey extends keyof ComplexDraft>(sectionId: TKey, value: ComplexDraft[TKey]) {
    setEditorState((currentState) => {
      if (!currentState.draft) {
        return currentState;
      }

      return {
        ...currentState,
        draft: {
          ...currentState.draft,
          [sectionId]: value
        },
        saveError: null,
        saveMessage: null,
        saveSectionId: sectionId as ComplexSectionId,
        saveStatus: 'idle'
      };
    });
  }

  async function handleSave(sectionId: ComplexSectionId) {
    if (!editorState.content || !editorState.draft) {
      return;
    }

    setEditorState((currentState) => ({
      ...currentState,
      saveError: null,
      saveMessage: null,
      saveSectionId: sectionId,
      saveStatus: 'saving'
    }));

    try {
      const content = await saveComplexSection(repoClient, {
        content: editorState.content,
        draft: editorState.draft,
        sectionId
      });

      setEditorState((currentState) => ({
        ...currentState,
        content,
        draft: createComplexDraft(content),
        saveError: null,
        saveMessage: `${getSectionLabel(sectionId)} saved to the repository-backed admin draft.`,
        saveSectionId: sectionId,
        saveStatus: 'success',
        status: 'success'
      }));

      try {
        await onSaved();
      } catch (error) {
        setEditorState((currentState) => ({
          ...currentState,
          saveError: `Saved ${getSectionLabel(sectionId)}, but the summary did not refresh: ${buildErrorMessage(error)}`,
          saveSectionId: sectionId,
          saveStatus: 'error'
        }));
      }
    } catch (error) {
      setEditorState((currentState) => ({
        ...currentState,
        saveError: buildErrorMessage(error),
        saveSectionId: sectionId,
        saveStatus: 'error'
      }));
    }
  }

  if (editorState.status === 'loading' && !editorState.content) {
    return (
      <Stack spacing={2}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
          Loading complex structured content
        </Typography>
        <LinearProgress />
      </Stack>
    );
  }

  if (!editorState.content || !editorState.draft) {
    return editorState.error ? <Alert severity="error">{editorState.error}</Alert> : null;
  }

  const pristineDraft = createComplexDraft(editorState.content);
  const isSaving = editorState.saveStatus === 'saving';
  const isDirty = (sectionId: ComplexSectionId) =>
    JSON.stringify(editorState.draft?.[sectionId]) !== JSON.stringify(pristineDraft[sectionId]);
  const resetSection = (sectionId: ComplexSectionId) => updateDraft(sectionId, pristineDraft[sectionId]);
  const shouldRenderSection = (sectionId: ComplexSectionId) => visibleSectionIds.includes(sectionId);

  const homepageDraft = editorState.draft.homepage;
  const staffDraft = editorState.draft.staff;
  const timesDraft = editorState.draft.times;

  function renderSectionHeaderActions(sectionId: ComplexSectionId, saveLabel: string) {
    const sectionIsDirty = isDirty(sectionId);
    const sectionIsSaving = editorState.saveSectionId === sectionId && isSaving;

    return (
      <>
        <IconButton
          aria-label="Reset"
          title="Reset"
          onClick={() => resetSection(sectionId)}
          disabled={!sectionIsDirty || sectionIsSaving}
          size="small"
        >
          <RestartAltIcon fontSize="small" />
        </IconButton>
        <Button
          variant="contained"
          color={sectionIsDirty || sectionIsSaving ? 'primary' : 'secondary'}
          onClick={() => void handleSave(sectionId)}
          disabled={!sectionIsDirty || sectionIsSaving}
          sx={
            !sectionIsDirty && !sectionIsSaving
              ? {
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(156, 39, 176, 0.12)',
                    color: 'secondary.main'
                  }
                }
              : undefined
          }
        >
          {sectionIsSaving ? 'Saving' : sectionIsDirty ? saveLabel : 'In Sync'}
        </Button>
      </>
    );
  }

  function updateHomepageSlide(index: number, nextValue: Partial<HomepageSlideDraft>) {
    const slides = homepageDraft.slides.map((slide, slideIndex) =>
      slideIndex === index ? { ...slide, ...nextValue } : slide
    );
    updateDraft('homepage', { ...homepageDraft, slides });
  }

  function updateHomepageFeatured(index: number, nextValue: Partial<HomepageFeaturedDraft>) {
    const featured = homepageDraft.featured.map((item, itemIndex) =>
      itemIndex === index ? ({ ...item, ...nextValue } as HomepageFeaturedDraft) : item
    );
    updateDraft('homepage', { ...homepageDraft, featured });
  }

  function moveHomepageSlide(activeId: string, overId: string) {
    const activeIndex = homepageDraft.slides.findIndex((_, index) => `${slideIdPrefix}-slide-${index}` === activeId);
    const overIndex = homepageDraft.slides.findIndex((_, index) => `${slideIdPrefix}-slide-${index}` === overId);

    if (activeIndex < 0 || overIndex < 0 || activeIndex === overIndex) {
      return;
    }

    updateDraft('homepage', {
      ...homepageDraft,
      slides: arrayMove(homepageDraft.slides, activeIndex, overIndex)
    });
  }

  function updateStaffEntry(index: number, nextValue: Partial<StaffEntryDraft>) {
    const staff = staffDraft.map((entry, entryIndex) => (entryIndex === index ? { ...entry, ...nextValue } : entry));
    updateDraft('staff', staff);
  }

  function handleImageAssetSelected(asset: MediaAsset) {
    if (!imagePickerTarget) {
      return;
    }

    if (imagePickerTarget.kind === 'homepage-schedule-background') {
      updateDraft('homepage', {
        ...homepageDraft,
        scheduleSectionBackground: asset.publicPath
      });
    }

    if (imagePickerTarget.kind === 'homepage-daily-readings-background') {
      updateDraft('homepage', {
        ...homepageDraft,
        dailyReadingsBackground: asset.publicPath
      });
    }

    if (imagePickerTarget.kind === 'homepage-slide') {
      updateHomepageSlide(imagePickerTarget.index, { image: asset.publicPath });
    }

    if (imagePickerTarget.kind === 'homepage-featured') {
      updateHomepageFeatured(imagePickerTarget.index, { image: asset.publicPath });
    }

    if (imagePickerTarget.kind === 'staff') {
      updateStaffEntry(imagePickerTarget.index, { picture: asset.publicPath });
    }

    setImagePickerTarget(null);
  }

  function openFeaturedMenu(event: MouseEvent<HTMLButtonElement>) {
    setFeaturedMenuAnchor(event.currentTarget);
  }

  function closeFeaturedMenu() {
    setFeaturedMenuAnchor(null);
  }

  function addHomepageFeaturedItem(type: HomepageFeaturedDraft['type']) {
    updateDraft('homepage', {
      ...homepageDraft,
      featured: [
        ...homepageDraft.featured,
        type === 'featured_page' ? { ...EMPTY_FEATURED_PAGE } : { ...EMPTY_FEATURED_LINK }
      ]
    });
    closeFeaturedMenu();
  }

  function handleSlidesDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    moveHomepageSlide(String(active.id), String(over.id));
  }

  const imagePickerTitle = imagePickerTarget?.kind === 'staff' ? 'Select staff image' : 'Select image';
  const imagePickerFolders: MediaFolderId[] = imagePickerTarget?.kind === 'staff' ? ['staff'] : ['shared'];
  const slideSortableIds = homepageDraft.slides.map((_, index) => `${slideIdPrefix}-slide-${index}`);
  const isFeaturedMenuOpen = Boolean(featuredMenuAnchor);

  return (
    <Stack spacing={2} sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
      {showIntroAlert ? (
        <Alert severity="info">
          Homepage repeaters, the full schedule widget, and staff entries now save directly through the live site-owned
          admin route.
        </Alert>
      ) : null}
      {editorState.saveMessage ? <Alert severity="success">{editorState.saveMessage}</Alert> : null}
      {editorState.saveError ? <Alert severity="error">{editorState.saveError}</Alert> : null}
      {editorState.status === 'loading' ? <LinearProgress /> : null}

      {shouldRenderSection('homepage') ? (
        <Stack
          direction={{ lg: 'row', xs: 'column' }}
          spacing={2}
          alignItems="stretch"
          sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}
        >
          <Stack
            spacing={2}
            sx={{
              flex: '0 0 460px',
              height: { lg: '100%', xs: 'auto' },
              minWidth: 0,
              minHeight: 0,
              overflowY: { lg: 'auto', xs: 'visible' },
              width: { lg: 460, xs: '100%' }
            }}
          >
            <StructuredSectionCard
              title="Homepage"
              headerActions={renderSectionHeaderActions('homepage', 'Save homepage')}
            >
              <Stack spacing={2}>
                <Tabs
                  value={homepageTab}
                  onChange={(_, next: HomepageEditorTabId) => setHomepageTab(next)}
                  variant="scrollable"
                  allowScrollButtonsMobile
                  sx={{ borderBottom: 1, borderColor: 'divider', mx: -0.5 }}
                >
                  <Tab label="Hero" value="hero" />
                  <Tab label="Sections" value="sections" />
                  <Tab label="Slides" value="slides" />
                  <Tab label="Featured" value="featured" />
                </Tabs>

                {homepageTab === 'hero' ? (
                  <HomepageEditorGroup title="Hero and livestream">
                    <TextField
                      label="Invitation text"
                      value={homepageDraft.invitationText}
                      onChange={(event) =>
                        updateDraft('homepage', { ...homepageDraft, invitationText: event.target.value })
                      }
                      fullWidth
                    />
                    <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
                      <TextField
                        label="Live stream button title"
                        value={homepageDraft.liveStreamButtonTitle}
                        onChange={(event) =>
                          updateDraft('homepage', { ...homepageDraft, liveStreamButtonTitle: event.target.value })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Live stream button URL"
                        value={homepageDraft.liveStreamButtonUrl}
                        onChange={(event) =>
                          updateDraft('homepage', { ...homepageDraft, liveStreamButtonUrl: event.target.value })
                        }
                        fullWidth
                      />
                    </Stack>
                  </HomepageEditorGroup>
                ) : null}

                {homepageTab === 'sections' ? (
                  <Stack spacing={2}>
                    <HomepageEditorGroup title="Schedule and daily readings">
                      <TextField
                        label="Schedule section title"
                        value={homepageDraft.scheduleSectionTitle}
                        onChange={(event) =>
                          updateDraft('homepage', { ...homepageDraft, scheduleSectionTitle: event.target.value })
                        }
                        fullWidth
                      />
                      <AdminImagePathField
                        buttonLabel="Select schedule background"
                        onSelectImage={() => setImagePickerTarget({ kind: 'homepage-schedule-background' })}
                        previewAlt="Schedule background preview"
                        value={homepageDraft.scheduleSectionBackground}
                      />
                      <TextField
                        label="Daily readings title"
                        value={homepageDraft.dailyReadingsTitle}
                        onChange={(event) =>
                          updateDraft('homepage', { ...homepageDraft, dailyReadingsTitle: event.target.value })
                        }
                        fullWidth
                      />
                      <AdminImagePathField
                        buttonLabel="Select daily readings background"
                        onSelectImage={() => setImagePickerTarget({ kind: 'homepage-daily-readings-background' })}
                        previewAlt="Daily readings background preview"
                        value={homepageDraft.dailyReadingsBackground}
                      />
                      <TextField
                        label="Daily readings subtitle"
                        value={homepageDraft.dailyReadingsSubtitle}
                        onChange={(event) =>
                          updateDraft('homepage', { ...homepageDraft, dailyReadingsSubtitle: event.target.value })
                        }
                        fullWidth
                        multiline
                        minRows={2}
                      />
                    </HomepageEditorGroup>

                    <HomepageEditorGroup title="Newsletter banner">
                      <TextField
                        label="Newsletter banner title"
                        value={homepageDraft.newsletterBannerTitle}
                        onChange={(event) =>
                          updateDraft('homepage', { ...homepageDraft, newsletterBannerTitle: event.target.value })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Newsletter banner subtitle"
                        value={homepageDraft.newsletterBannerSubtitle}
                        onChange={(event) =>
                          updateDraft('homepage', { ...homepageDraft, newsletterBannerSubtitle: event.target.value })
                        }
                        fullWidth
                        multiline
                        minRows={2}
                      />
                      <TextField
                        label="Newsletter signup link"
                        value={homepageDraft.newsletterSignupLink}
                        onChange={(event) =>
                          updateDraft('homepage', { ...homepageDraft, newsletterSignupLink: event.target.value })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Newsletter signup button text"
                        value={homepageDraft.newsletterSignupButtonText}
                        onChange={(event) =>
                          updateDraft('homepage', {
                            ...homepageDraft,
                            newsletterSignupButtonText: event.target.value
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Newsletter RSS feed URL"
                        value={homepageDraft.newsletterRssFeedUrl}
                        onChange={(event) =>
                          updateDraft('homepage', { ...homepageDraft, newsletterRssFeedUrl: event.target.value })
                        }
                        fullWidth
                      />
                    </HomepageEditorGroup>
                  </Stack>
                ) : null}

                {homepageTab === 'slides' ? (
                  <HomepageEditorGroup
                    title="Slides"
                    actions={
                      <Button
                        startIcon={<AddIcon />}
                        variant="outlined"
                        onClick={() =>
                          updateDraft('homepage', {
                            ...homepageDraft,
                            slides: [...homepageDraft.slides, { ...EMPTY_HOMEPAGE_SLIDE }]
                          })
                        }
                      >
                        Add slide
                      </Button>
                    }
                  >
                    <DndContext
                      collisionDetection={closestCenter}
                      onDragEnd={handleSlidesDragEnd}
                      sensors={slideDragSensors}
                    >
                      <SortableContext items={slideSortableIds} strategy={verticalListSortingStrategy}>
                        <Stack spacing={2}>
                          {homepageDraft.slides.map((slide, index) => {
                            const slideId = slideSortableIds[index];
                            const imageAlt = slide.title || `Homepage slide ${index + 1}`;
                            const hasImage = slide.image.trim().length > 0;

                            return (
                              <SortableAccordionRepeaterCard
                                key={slideId}
                                id={slideId}
                                title={`Slide ${index + 1}`}
                                summary={slide.title || (hasImage ? slide.image : 'No text or image selected yet.')}
                                preview={
                                  hasImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
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
                                    value={slide.title}
                                    onChange={(event) => updateHomepageSlide(index, { title: event.target.value })}
                                    fullWidth
                                  />
                                  <AdminImagePathField
                                    onSelectImage={() => setImagePickerTarget({ kind: 'homepage-slide', index })}
                                    previewAlt={imageAlt}
                                    value={slide.image}
                                  />
                                </Stack>
                                <Button
                                  variant="outlined"
                                  color="inherit"
                                  onClick={() =>
                                    updateDraft('homepage', {
                                      ...homepageDraft,
                                      slides: homepageDraft.slides.filter((_, slideIndex) => slideIndex !== index)
                                    })
                                  }
                                >
                                  Remove slide
                                </Button>
                              </SortableAccordionRepeaterCard>
                            );
                          })}
                        </Stack>
                      </SortableContext>
                    </DndContext>
                  </HomepageEditorGroup>
                ) : null}

                {homepageTab === 'featured' ? (
                  <HomepageEditorGroup
                    title="Featured items"
                    actions={
                      <Fragment>
                        <Button
                          aria-controls={isFeaturedMenuOpen ? 'homepage-featured-add-menu' : undefined}
                          aria-expanded={isFeaturedMenuOpen ? 'true' : undefined}
                          aria-haspopup="menu"
                          endIcon={<ExpandMoreIcon />}
                          startIcon={<AddIcon />}
                          variant="outlined"
                          onClick={openFeaturedMenu}
                        >
                          Add featured item
                        </Button>
                        <Menu
                          anchorEl={featuredMenuAnchor}
                          id="homepage-featured-add-menu"
                          open={isFeaturedMenuOpen}
                          onClose={closeFeaturedMenu}
                          PaperProps={{
                            sx: {
                              backgroundColor: '#fffaf4',
                              backgroundImage: 'none',
                              border: '1px solid rgba(127, 35, 44, 0.12)',
                              boxShadow: '0 18px 40px rgba(57, 33, 24, 0.14)',
                              opacity: 1
                            }
                          }}
                        >
                          <MenuItem onClick={() => addHomepageFeaturedItem('featured_link')}>Featured link</MenuItem>
                          <MenuItem onClick={() => addHomepageFeaturedItem('featured_page')}>Featured page</MenuItem>
                        </Menu>
                      </Fragment>
                    }
                  >
                    <Stack spacing={2}>
                      {homepageDraft.featured.map((item, index) => (
                        <RepeaterCard
                          key={`homepage-featured-${index}`}
                          title={`Featured ${index + 1}: ${item.type === 'featured_page' ? 'Page' : 'Link'}`}
                        >
                          {item.type === 'featured_page' ? (
                            <Stack spacing={2}>
                              <TextField
                                label="Page slug"
                                value={item.pageSlug}
                                onChange={(event) => updateHomepageFeatured(index, { pageSlug: event.target.value })}
                                fullWidth
                              />
                              <TextField
                                label="Page title"
                                helperText="Used to preserve the legacy slug|title relation string."
                                value={item.pageTitle}
                                onChange={(event) => updateHomepageFeatured(index, { pageTitle: event.target.value })}
                                fullWidth
                              />
                              <AdminImagePathField
                                onSelectImage={() => setImagePickerTarget({ kind: 'homepage-featured', index })}
                                previewAlt={item.pageTitle || `Featured page ${index + 1}`}
                                value={item.image}
                              />
                              <TextField
                                label="Summary"
                                value={item.summary}
                                onChange={(event) => updateHomepageFeatured(index, { summary: event.target.value })}
                                fullWidth
                                multiline
                                minRows={3}
                              />
                            </Stack>
                          ) : (
                            <Stack spacing={2}>
                              <TextField
                                label="Title"
                                value={item.title}
                                onChange={(event) => updateHomepageFeatured(index, { title: event.target.value })}
                                fullWidth
                              />
                              <TextField
                                label="URL"
                                value={item.url}
                                onChange={(event) => updateHomepageFeatured(index, { url: event.target.value })}
                                fullWidth
                              />
                              <AdminImagePathField
                                onSelectImage={() => setImagePickerTarget({ kind: 'homepage-featured', index })}
                                previewAlt={item.title || `Featured link ${index + 1}`}
                                value={item.image}
                              />
                              <TextField
                                label="Summary"
                                value={item.summary}
                                onChange={(event) => updateHomepageFeatured(index, { summary: event.target.value })}
                                fullWidth
                                multiline
                                minRows={3}
                              />
                            </Stack>
                          )}
                          <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() =>
                              updateDraft('homepage', {
                                ...homepageDraft,
                                featured: homepageDraft.featured.filter((_, itemIndex) => itemIndex !== index)
                              })
                            }
                          >
                            Remove featured item
                          </Button>
                        </RepeaterCard>
                      ))}
                    </Stack>
                  </HomepageEditorGroup>
                ) : null}
              </Stack>
            </StructuredSectionCard>
          </Stack>

          <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0, minHeight: 0, overflow: 'hidden', width: '100%' }}>
            <HomepagePreview draft={homepageDraft} />
          </Stack>
        </Stack>
      ) : null}

      {shouldRenderSection('times') ? (
        <StructuredSectionCard
          title="Times"
          description="The existing schedule widget now runs inside the site-owned admin flow for content/times.json."
          headerActions={renderSectionHeaderActions('times', 'Save times')}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={2}>
              <Typography sx={{ color: '#5d4a40', lineHeight: 1.7 }}>
                This reuses the existing schedule editor logic while moving the load and save path into the first-party
                admin services.
              </Typography>
              <div>
                <ScheduleWidget times={timesDraft} onChange={(times) => updateDraft('times', times)} />
              </div>
            </Stack>
          </LocalizationProvider>
        </StructuredSectionCard>
      ) : null}

      {shouldRenderSection('staff') ? (
        <StructuredSectionCard
          title="Staff"
          description="Parish staff cards from content/staff.json. Image paths and ordering are editable here."
          headerActions={renderSectionHeaderActions('staff', 'Save staff')}
        >
          <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5} justifyContent="space-between">
            <Typography sx={{ color: '#5d4a40', lineHeight: 1.7 }}>
              Reorder by moving cards in the list order here, then save the updated JSON contract.
            </Typography>
            <Button variant="outlined" onClick={() => updateDraft('staff', [...staffDraft, { ...EMPTY_STAFF_ENTRY }])}>
              Add staff entry
            </Button>
          </Stack>
          <Stack spacing={2}>
            {staffDraft.map((entry, index) => (
              <RepeaterCard key={`staff-entry-${index}`} title={`Staff ${index + 1}`}>
                <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
                  <TextField
                    label="Name"
                    value={entry.name}
                    onChange={(event) => updateStaffEntry(index, { name: event.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Title"
                    value={entry.title}
                    onChange={(event) => updateStaffEntry(index, { title: event.target.value })}
                    fullWidth
                  />
                </Stack>
                <AdminImagePathField
                  onSelectImage={() => setImagePickerTarget({ kind: 'staff', index })}
                  previewAlt={entry.name || `Staff entry ${index + 1}`}
                  value={entry.picture}
                />
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() =>
                    updateDraft(
                      'staff',
                      staffDraft.filter((_, entryIndex) => entryIndex !== index)
                    )
                  }
                >
                  Remove staff entry
                </Button>
              </RepeaterCard>
            ))}
          </Stack>
        </StructuredSectionCard>
      ) : null}

      <Dialog fullWidth maxWidth="lg" onClose={() => setImagePickerTarget(null)} open={Boolean(imagePickerTarget)}>
        <DialogTitle>{imagePickerTitle}</DialogTitle>
        <DialogContent dividers>
          <AdminMediaLibrary
            allowedFolderIds={imagePickerFolders}
            onChange={onSaved}
            onSelectAsset={handleImageAssetSelected}
            repoClient={repoClient}
            selectionFilter="images"
            selectionLabel="Use selected image"
            title={imagePickerTitle}
          />
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
