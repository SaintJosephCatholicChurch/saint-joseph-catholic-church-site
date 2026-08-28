'use client';

import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { arrayMoveImmutable } from '../util/array.util';
import { AdminSelectableCard } from './components/AdminCards';
import {
  AdminCompactActionBar,
  AdminListSidebar,
  AdminRecordHeader,
  AdminRecordWorkspacePanel,
  AdminSidebarListBody,
  AdminStatusStack
} from './components/AdminWorkspace';
import { AdminDialogTitle } from './components/AdminDialogTitle';
import { AdminSupportPreviewInset, AdminSupportPreviewSurface } from './components/AdminSupport';
import { AdminMediaLibrary, AdminMediaLibraryViewToggle, type MediaLibraryViewMode } from './AdminMediaLibrary';
import {
  createEmptyBulletinDraft,
  createBulletinDraft,
  createBulletinSummaries,
  deleteBulletin,
  getBulletinPdfListLabel,
  loadBulletinMediaContent,
  saveBulletin,
  type BulletinDraft,
  type BulletinMediaContent,
  type BulletinSummary,
  type MediaAsset
} from './content/writableBulletinsMediaContent';
import { useAdminUnsavedChanges, useRegisterAdminDirty } from './unsavedChanges';

import type { AdminRepoClient } from './services/adminTypes';

interface BulletinMediaEditorProps {
  onSaved: () => Promise<void>;
  repoClient: AdminRepoClient;
}

interface BulletinEditorState {
  content: BulletinMediaContent | null;
  error: string | null;
  saveError: string | null;
  saveMessage: string | null;
  saveStatus: 'error' | 'idle' | 'saving' | 'success';
  selectedBulletinId: string;
  status: 'error' | 'idle' | 'loading' | 'success';
}

const NEW_BULLETIN_ID = '__new_bulletin__';
const BULLETIN_SELECTION_QUERY_PARAM = 'entry';

const INITIAL_EDITOR_STATE: BulletinEditorState = {
  content: null,
  error: null,
  saveError: null,
  saveMessage: null,
  saveStatus: 'idle',
  selectedBulletinId: NEW_BULLETIN_ID,
  status: 'idle'
};

function buildErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'The bulletin and media editor failed to load.';
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-').map(Number);
  if (parts.length < 3 || parts.some(isNaN)) return dateStr;
  const [year, month, day] = parts;
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function SortableBulletinPdfRow({
  id,
  onChange,
  onRemove,
  pdfPath
}: {
  id: string;
  onChange: () => void;
  onRemove: () => void;
  pdfPath: string;
}) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const fileName = pdfPath.split('/').pop() || pdfPath;

  return (
    <Stack
      ref={setNodeRef}
      direction="row"
      spacing={1.25}
      alignItems="center"
      sx={{
        background: '#fbfaf8',
        border: '1px solid rgba(191, 48, 60, 0.12)',
        borderRadius: '4px',
        opacity: isDragging ? 0.92 : 1,
        p: 1.25,
        transform: CSS.Transform.toString(transform),
        transition
      }}
    >
      <IconButton
        aria-label={`Reorder ${fileName}`}
        size="small"
        {...attributes}
        {...listeners}
        sx={{ color: '#7a5d50', cursor: isDragging ? 'grabbing' : 'grab', flexShrink: 0 }}
      >
        <DragIndicatorIcon fontSize="small" />
      </IconButton>
      <AdminSupportPreviewSurface sx={{ flex: 1, minWidth: 0, p: 1.25 }}>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
          <AdminSupportPreviewInset
            sx={{
              color: '#7f232c',
              flexShrink: 0,
              p: 1
            }}
          >
            <PictureAsPdfIcon fontSize="small" />
          </AdminSupportPreviewInset>
          <Stack spacing={0.25} sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {fileName}
            </Typography>
            <Typography
              sx={{
                color: '#6a5448',
                fontSize: '0.82rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {pdfPath}
            </Typography>
          </Stack>
        </Stack>
      </AdminSupportPreviewSurface>
      <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
        <Button color="inherit" href={pdfPath} rel="noreferrer" size="small" target="_blank" variant="outlined">
          Open
        </Button>
        <Button onClick={onChange} size="small" variant="outlined">
          Change
        </Button>
        <IconButton aria-label={`Remove ${fileName}`} onClick={onRemove} size="small">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
}

function BulletinListCard({
  active,
  compact = false,
  item,
  onSelect
}: {
  active: boolean;
  compact?: boolean;
  item: BulletinSummary;
  onSelect: (bulletinId: string) => void;
}) {
  const formattedDate = formatDate(item.date) || 'No date';

  return (
    <AdminSelectableCard
      active={active}
      onClick={() => onSelect(item.id)}
      sx={{
        flexShrink: 0,
        px: compact ? 1.5 : 2,
        py: compact ? 1.125 : 1.5
      }}
    >
      {compact ? (
        <Stack
          direction="row"
          spacing={1.25}
          alignItems="center"
          justifyContent="space-between"
          sx={{ minWidth: 0, width: '100%' }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <Typography
              sx={{
                flexShrink: 0,
                fontWeight: 700,
                whiteSpace: 'nowrap'
              }}
            >
              {formattedDate}
            </Typography>
            {item.name ? (
              <Typography
                sx={{
                  color: active ? 'rgba(255,255,255,0.82)' : '#6a5448',
                  fontSize: '0.8rem',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.name}
              </Typography>
            ) : null}
          </Stack>
          <Typography
            sx={{
              color: active ? 'rgba(255,255,255,0.8)' : '#6a5448',
              flex: '0 1 40%',
              fontSize: '0.76rem',
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'right',
              whiteSpace: 'nowrap'
            }}
          >
            {getBulletinPdfListLabel(item.pdfs)}
          </Typography>
        </Stack>
      ) : (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
          <Typography
            sx={{
              fontWeight: 700,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {[formatDate(item.date), item.name].filter(Boolean).join(' — ') || 'No date or title'}
          </Typography>
          <Typography
            sx={{
              color: active ? 'inherit' : '#6a5448',
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {getBulletinPdfListLabel(item.pdfs)}
          </Typography>
        </Box>
      )}
    </AdminSelectableCard>
  );
}

function findBulletinById(content: BulletinMediaContent | null, bulletinId: string) {
  if (!content || bulletinId === NEW_BULLETIN_ID) {
    return null;
  }

  return content.bulletins.find((bulletin) => `bulletin:${bulletin.path}` === bulletinId) || null;
}

function createDraftForSelection(content: BulletinMediaContent | null, bulletinId: string) {
  const activeBulletin = findBulletinById(content, bulletinId);
  return activeBulletin ? createBulletinDraft(activeBulletin) : createEmptyBulletinDraft();
}

export function BulletinMediaEditor({ onSaved, repoClient }: BulletinMediaEditorProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isCompactLayout = useMediaQuery(theme.breakpoints.down('xl'));
  const routedBulletinId = searchParams.get(BULLETIN_SELECTION_QUERY_PARAM);
  const [editorState, setEditorState] = useState<BulletinEditorState>(INITIAL_EDITOR_STATE);
  const [draft, setDraft] = useState<BulletinDraft>(createEmptyBulletinDraft());
  const [pdfPickerTarget, setPdfPickerTarget] = useState<number | 'append' | null>(null);
  const [mediaLibraryViewMode, setMediaLibraryViewMode] = useState<MediaLibraryViewMode>('list');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { confirmIfDirty } = useAdminUnsavedChanges();
  const selectedBulletinIdRef = useRef(INITIAL_EDITOR_STATE.selectedBulletinId);
  const sortableSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const buildSelectionHref = useCallback(
    (bulletinId: string | null) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (bulletinId) {
        nextParams.set(BULLETIN_SELECTION_QUERY_PARAM, bulletinId);
      } else {
        nextParams.delete(BULLETIN_SELECTION_QUERY_PARAM);
      }

      const query = nextParams.toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [pathname, searchParams]
  );

  const replaceSelectionInUrl = useCallback(
    (bulletinId: string | null) => {
      router.replace(buildSelectionHref(bulletinId), { scroll: false });
    },
    [buildSelectionHref, router]
  );

  useEffect(() => {
    selectedBulletinIdRef.current = editorState.selectedBulletinId;
  }, [editorState.selectedBulletinId]);

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      setEditorState((currentState) => ({
        ...currentState,
        error: null,
        status: 'loading'
      }));

      try {
        const content = await loadBulletinMediaContent(repoClient);

        if (cancelled) {
          return;
        }

        const summaries = createBulletinSummaries(content);
        const preferredBulletinId = routedBulletinId || selectedBulletinIdRef.current;
        const selectedBulletinId =
          preferredBulletinId === NEW_BULLETIN_ID
            ? NEW_BULLETIN_ID
            : preferredBulletinId !== NEW_BULLETIN_ID && summaries.some((summary) => summary.id === preferredBulletinId)
              ? preferredBulletinId
              : summaries[0]?.id || NEW_BULLETIN_ID;

        setEditorState((currentState) => ({
          ...currentState,
          content,
          error: null,
          selectedBulletinId,
          status: 'success'
        }));
        setDraft(createDraftForSelection(content, selectedBulletinId));
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

  const summaries = useMemo(
    () => (editorState.content ? createBulletinSummaries(editorState.content) : []),
    [editorState.content]
  );
  const activeBulletin = findBulletinById(editorState.content, editorState.selectedBulletinId);
  const pristineDraft = activeBulletin ? createBulletinDraft(activeBulletin) : createEmptyBulletinDraft();
  const isDirty = JSON.stringify(draft) !== JSON.stringify(pristineDraft);
  useRegisterAdminDirty('bulletins', isDirty);
  const isSaving = editorState.saveStatus === 'saving';
  const showListViewOnly = isCompactLayout && !routedBulletinId;
  const showDenseListCards = isCompactLayout;
  const showActiveListSelection = !isCompactLayout || Boolean(routedBulletinId);
  const bulletinEditorActions = (
    <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ flexShrink: 0 }}>
      <IconButton
        aria-label="Reset"
        title="Reset"
        onClick={() => setDraft(pristineDraft)}
        disabled={!isDirty || isSaving}
        size="small"
      >
        <RestartAltIcon fontSize="small" />
      </IconButton>
      <Button disabled={!isDirty || isSaving} onClick={() => void handleSave()} variant="contained">
        Save
      </Button>
      <IconButton
        aria-label="Delete"
        title="Delete"
        onClick={() => setDeleteDialogOpen(true)}
        disabled={isSaving || !activeBulletin}
        size="small"
      >
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Stack>
  );

  function selectBulletin(bulletinId: string) {
    if (bulletinId !== editorState.selectedBulletinId && isDirty && !confirmIfDirty()) {
      return;
    }

    setEditorState((currentState) => ({
      ...currentState,
      saveError: null,
      saveMessage: null,
      saveStatus: 'idle',
      selectedBulletinId: bulletinId
    }));
    setDraft(createDraftForSelection(editorState.content, bulletinId));
    replaceSelectionInUrl(bulletinId);
  }

  function returnToBulletinList() {
    if (isDirty && !confirmIfDirty()) {
      return;
    }

    replaceSelectionInUrl(null);
  }

  function updateDraft(nextValue: Partial<BulletinDraft>) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      ...nextValue
    }));
    setEditorState((currentState) => ({
      ...currentState,
      saveError: null,
      saveMessage: null,
      saveStatus: 'idle'
    }));
  }

  function handlePdfsDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = draft.pdfs.indexOf(String(active.id));
    const newIndex = draft.pdfs.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
      return;
    }

    updateDraft({ pdfs: arrayMoveImmutable(draft.pdfs, oldIndex, newIndex) });
  }

  function removePdf(index: number) {
    updateDraft({ pdfs: draft.pdfs.filter((_, pdfIndex) => pdfIndex !== index) });
  }

  function handleSelectedPdf(asset: MediaAsset) {
    const nextPath = asset.publicPath;
    const existingIndex = draft.pdfs.indexOf(nextPath);

    if (pdfPickerTarget === 'append') {
      if (existingIndex >= 0) {
        setEditorState((currentState) => ({
          ...currentState,
          saveError: 'That PDF is already attached to this bulletin.',
          saveStatus: 'error'
        }));
        return;
      }

      updateDraft({ pdfs: [...draft.pdfs, nextPath] });
      setPdfPickerTarget(null);
      return;
    }

    if (typeof pdfPickerTarget !== 'number') {
      return;
    }

    if (existingIndex >= 0 && existingIndex !== pdfPickerTarget) {
      setEditorState((currentState) => ({
        ...currentState,
        saveError: 'That PDF is already attached to this bulletin.',
        saveStatus: 'error'
      }));
      return;
    }

    const nextPdfs = [...draft.pdfs];
    nextPdfs[pdfPickerTarget] = nextPath;
    updateDraft({ pdfs: nextPdfs });
    setPdfPickerTarget(null);
  }

  async function refreshContent(options?: { preserveDraft?: boolean; selectedBulletinId?: string }) {
    const content = await loadBulletinMediaContent(repoClient);
    const summaries = createBulletinSummaries(content);
    const selectedBulletinId =
      options?.selectedBulletinId && summaries.some((summary) => summary.id === options.selectedBulletinId)
        ? options.selectedBulletinId
        : summaries.some((summary) => summary.id === editorState.selectedBulletinId)
          ? editorState.selectedBulletinId
          : summaries[0]?.id || NEW_BULLETIN_ID;

    setEditorState((currentState) => ({
      ...currentState,
      content,
      error: null,
      selectedBulletinId,
      status: 'success'
    }));

    if (!options?.preserveDraft) {
      setDraft(createDraftForSelection(content, selectedBulletinId));
    }
  }

  async function handleSave() {
    if (!editorState.content) {
      return;
    }

    setEditorState((currentState) => ({
      ...currentState,
      saveError: null,
      saveMessage: null,
      saveStatus: 'saving'
    }));

    try {
      const savedBulletin = await saveBulletin(repoClient, {
        bulletin: activeBulletin,
        content: editorState.content,
        draft
      });
      const nextSelectedBulletinId = `bulletin:${savedBulletin.path}`;

      await refreshContent({ selectedBulletinId: nextSelectedBulletinId });
      replaceSelectionInUrl(nextSelectedBulletinId);
      setEditorState((currentState) => ({
        ...currentState,
        saveError: null,
        saveMessage: 'Bulletin saved.',
        saveStatus: 'success'
      }));

      try {
        await onSaved();
      } catch (error) {
        setEditorState((currentState) => ({
          ...currentState,
          saveError: `Saved the bulletin, but the summary did not refresh: ${buildErrorMessage(error)}`,
          saveStatus: 'error'
        }));
      }
    } catch (error) {
      setEditorState((currentState) => ({
        ...currentState,
        saveError: buildErrorMessage(error),
        saveStatus: 'error'
      }));
    }
  }

  async function handleDelete() {
    if (!editorState.content || !activeBulletin) {
      return;
    }

    setEditorState((currentState) => ({
      ...currentState,
      saveError: null,
      saveMessage: null,
      saveStatus: 'saving'
    }));

    try {
      const content = await deleteBulletin(repoClient, {
        bulletin: activeBulletin,
        content: editorState.content
      });
      const summaries = createBulletinSummaries(content);
      const nextSelectedBulletinId = summaries[0]?.id || NEW_BULLETIN_ID;

      setDeleteDialogOpen(false);
      setEditorState((currentState) => ({
        ...currentState,
        content,
        saveError: null,
        saveMessage: 'Bulletin deleted.',
        saveStatus: 'success',
        selectedBulletinId: nextSelectedBulletinId,
        status: 'success'
      }));
      setDraft(createDraftForSelection(content, nextSelectedBulletinId));
      replaceSelectionInUrl(isCompactLayout ? null : nextSelectedBulletinId);

      try {
        await onSaved();
      } catch {
        // summary refresh failed, non-critical
      }
    } catch (error) {
      setDeleteDialogOpen(false);
      setEditorState((currentState) => ({
        ...currentState,
        saveError: buildErrorMessage(error),
        saveStatus: 'error'
      }));
    }
  }

  async function handleMediaChanged() {
    try {
      await refreshContent({ preserveDraft: true });
      await onSaved();
    } catch (error) {
      setEditorState((currentState) => ({
        ...currentState,
        saveError: `Media changes succeeded, but the summary did not refresh: ${buildErrorMessage(error)}`,
        saveStatus: 'error'
      }));
    }
  }

  useEffect(() => {
    if (!editorState.content || !routedBulletinId) {
      return;
    }

    if (routedBulletinId !== NEW_BULLETIN_ID && !summaries.some((summary) => summary.id === routedBulletinId)) {
      return;
    }

    if (routedBulletinId === editorState.selectedBulletinId) {
      return;
    }

    if (isDirty && !confirmIfDirty()) {
      replaceSelectionInUrl(editorState.selectedBulletinId);
      return;
    }

    setEditorState((currentState) => ({
      ...currentState,
      selectedBulletinId: routedBulletinId
    }));
    setDraft(createDraftForSelection(editorState.content, routedBulletinId));
  }, [confirmIfDirty, editorState.content, editorState.selectedBulletinId, isDirty, replaceSelectionInUrl, routedBulletinId, summaries]);

  useEffect(() => {
    if (summaries.length > 0) {
      if (editorState.selectedBulletinId === NEW_BULLETIN_ID) {
        return;
      }

      if (summaries.some((summary) => summary.id === editorState.selectedBulletinId)) {
        return;
      }

      const fallbackBulletinId = summaries[0].id;
      setEditorState((currentState) => ({
        ...currentState,
        selectedBulletinId: fallbackBulletinId
      }));

      if (routedBulletinId) {
        replaceSelectionInUrl(fallbackBulletinId);
      }

      return;
    }

    if (editorState.selectedBulletinId !== NEW_BULLETIN_ID) {
      setEditorState((currentState) => ({
        ...currentState,
        selectedBulletinId: NEW_BULLETIN_ID
      }));
    }
  }, [editorState.selectedBulletinId, replaceSelectionInUrl, routedBulletinId, summaries]);

  if (editorState.status === 'loading' && !editorState.content) {
    return (
      <Stack spacing={2}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
          Loading bulletin and media workflows
        </Typography>
        <LinearProgress />
      </Stack>
    );
  }

  if (!editorState.content) {
    return editorState.error ? <Alert severity="error">{editorState.error}</Alert> : null;
  }

  return (
    <Stack spacing={2} sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <AdminStatusStack
        errorMessage={editorState.saveError}
        loading={editorState.status === 'loading'}
        successMessage={editorState.saveMessage}
      />

      <Stack direction={{ xl: 'row', xs: 'column' }} spacing={2} alignItems="stretch" sx={{ flex: 1, minHeight: 0 }}>
        {!isCompactLayout || showListViewOnly ? (
          <AdminListSidebar
            actions={
              <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5} justifyContent="space-between">
                <Button onClick={() => selectBulletin(NEW_BULLETIN_ID)} variant="contained" size="small" fullWidth>
                  New bulletin
                </Button>
              </Stack>
            }
            emptyState={summaries.length === 0 ? <Alert severity="info">No bulletins are available yet.</Alert> : null}
            sx={{
              height: { xl: '100%', xs: 'auto' },
              maxHeight: { xl: '100%', xs: 'none' },
              width: { xl: 340, xs: '100%' }
            }}
          >
            {summaries.length > 0 ? (
              <AdminSidebarListBody dense={showDenseListCards}>
                {summaries.map((item) => (
                  <BulletinListCard
                    key={item.id}
                    active={showActiveListSelection && item.id === editorState.selectedBulletinId}
                    compact={showDenseListCards}
                    item={item}
                    onSelect={selectBulletin}
                  />
                ))}
              </AdminSidebarListBody>
            ) : null}
          </AdminListSidebar>
        ) : null}

        {!showListViewOnly ? (
          <Stack spacing={2} sx={{ flex: 1, minHeight: 0, minWidth: 0 }}>
            {isCompactLayout ? (
              <AdminCompactActionBar actions={bulletinEditorActions} onBack={returnToBulletinList} />
            ) : null}
            <AdminRecordWorkspacePanel panelSx={{ flex: 1 }} contentSx={{ overflowY: { xl: 'auto', xs: 'visible' } }}>
              <Stack spacing={2}>
                <AdminRecordHeader
                  actions={!isCompactLayout ? bulletinEditorActions : null}
                  title={activeBulletin ? 'Bulletin editor' : 'New bulletin'}
                />

                <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
                  <TextField
                    label="Bulletin date"
                    type="date"
                    value={draft.date}
                    onChange={(event) => updateDraft({ date: event.target.value })}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Bulletin title"
                    value={draft.name}
                    onChange={(event) => updateDraft({ name: event.target.value })}
                    fullWidth
                  />
                </Stack>

                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontWeight: 700 }}>Linked PDFs</Typography>
                    <Button onClick={() => setPdfPickerTarget('append')} startIcon={<AddIcon />} variant="outlined">
                      Add PDF
                    </Button>
                  </Stack>
                  {draft.pdfs.length > 0 ? (
                    <DndContext
                      collisionDetection={closestCenter}
                      onDragEnd={handlePdfsDragEnd}
                      sensors={sortableSensors}
                    >
                      <SortableContext items={draft.pdfs} strategy={verticalListSortingStrategy}>
                        <Stack spacing={1.25}>
                          {draft.pdfs.map((pdfPath, index) => (
                            <SortableBulletinPdfRow
                              key={pdfPath}
                              id={pdfPath}
                              onChange={() => setPdfPickerTarget(index)}
                              onRemove={() => removePdf(index)}
                              pdfPath={pdfPath}
                            />
                          ))}
                        </Stack>
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <Typography sx={{ color: '#6a5448', fontSize: '0.82rem', lineHeight: 1.6 }}>
                      No PDFs are attached yet.
                    </Typography>
                  )}
                  <Typography sx={{ color: '#6a5448', fontSize: '0.82rem', lineHeight: 1.6 }}>
                    Bulletin PDFs must stay under /bulletins. Drag to reorder them; the public bulletin viewer shows
                    their pages in this order after the PDFs are processed into images.
                  </Typography>
                </Stack>
                {!activeBulletin ? (
                  <Typography sx={{ color: '#6a5448', lineHeight: 1.6 }}>
                    A new bulletin metadata file will be created from the selected date.
                  </Typography>
                ) : null}
              </Stack>
            </AdminRecordWorkspacePanel>
          </Stack>
        ) : null}
      </Stack>

      <Dialog fullWidth maxWidth="lg" onClose={() => setPdfPickerTarget(null)} open={pdfPickerTarget !== null}>
        <AdminDialogTitle
          actions={<AdminMediaLibraryViewToggle value={mediaLibraryViewMode} onChange={setMediaLibraryViewMode} />}
          onClose={() => setPdfPickerTarget(null)}
        >
          Select or upload bulletin PDF
        </AdminDialogTitle>
        <DialogContent dividers>
          <AdminMediaLibrary
            allowedFolderIds={['bulletins']}
            currentAssetPublicPath={typeof pdfPickerTarget === 'number' ? draft.pdfs[pdfPickerTarget] : undefined}
            onChange={handleMediaChanged}
            onSelectAsset={handleSelectedPdf}
            repoClient={repoClient}
            selectionFilter="files"
            selectionLabel="Use selected PDF"
            showHeader={false}
            title="Bulletin PDF selector"
            viewMode={mediaLibraryViewMode}
          />
        </DialogContent>
      </Dialog>
      <Dialog fullWidth maxWidth="xs" onClose={() => setDeleteDialogOpen(false)} open={deleteDialogOpen}>
        <AdminDialogTitle onClose={() => setDeleteDialogOpen(false)}>Delete bulletin</AdminDialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Delete “{activeBulletin?.value.name || 'this bulletin'}”? This removes the metadata file from the repository.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button color="inherit" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button color="error" onClick={() => void handleDelete()} variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
