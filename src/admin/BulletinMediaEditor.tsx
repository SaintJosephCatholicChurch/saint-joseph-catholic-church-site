'use client';

import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AdminSelectableCard } from './components/AdminCards';
import {
  AdminCompactActionBar,
  AdminListSidebar,
  AdminRecordHeader,
  AdminRecordWorkspacePanel,
  AdminSidebarListBody,
  AdminStatusStack
} from './components/AdminWorkspace';
import { AdminFilePathField } from './AdminFilePathField';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import {
  createEmptyBulletinDraft,
  createBulletinDraft,
  createBulletinSummaries,
  loadBulletinMediaContent,
  saveBulletin,
  type BulletinDraft,
  type BulletinMediaContent,
  type BulletinSummary
} from './content/writableBulletinsMediaContent';

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
            {item.pdf ? item.pdf.split('/').pop() || item.pdf : 'No linked PDF'}
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
            {item.pdf ? item.pdf.split('/').pop() || item.pdf : 'No linked PDF'}
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
  const [pdfPickerOpen, setPdfPickerOpen] = useState(false);
  const selectedBulletinIdRef = useRef(INITIAL_EDITOR_STATE.selectedBulletinId);

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
  }, [repoClient, routedBulletinId]);

  const summaries = useMemo(
    () => (editorState.content ? createBulletinSummaries(editorState.content) : []),
    [editorState.content]
  );
  const activeBulletin = findBulletinById(editorState.content, editorState.selectedBulletinId);
  const pristineDraft = activeBulletin ? createBulletinDraft(activeBulletin) : createEmptyBulletinDraft();
  const isDirty = JSON.stringify(draft) !== JSON.stringify(pristineDraft);
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
    </Stack>
  );

  function selectBulletin(bulletinId: string) {
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

    setEditorState((currentState) => ({
      ...currentState,
      selectedBulletinId: routedBulletinId
    }));
    setDraft(createDraftForSelection(editorState.content, routedBulletinId));
  }, [editorState.content, editorState.selectedBulletinId, routedBulletinId, summaries]);

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
                  <Typography sx={{ fontWeight: 700 }}>Linked PDF</Typography>
                  <AdminFilePathField
                    buttonLabel="Select PDF"
                    onSelectFile={() => setPdfPickerOpen(true)}
                    openLabel="Open PDF"
                    value={draft.pdf}
                  />
                  <Typography sx={{ color: '#6a5448', fontSize: '0.82rem', lineHeight: 1.6 }}>
                    Bulletin PDFs must stay under /bulletins. Use the picker to select an existing PDF or upload a new
                    one.
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

      <Dialog fullWidth maxWidth="lg" onClose={() => setPdfPickerOpen(false)} open={pdfPickerOpen}>
        <DialogTitle>Select or upload bulletin PDF</DialogTitle>
        <DialogContent dividers>
          <AdminMediaLibrary
            allowedFolderIds={['bulletins']}
            onChange={handleMediaChanged}
            onSelectAsset={(asset) => {
              updateDraft({ pdf: asset.publicPath });
              setPdfPickerOpen(false);
            }}
            repoClient={repoClient}
            selectionFilter="files"
            selectionLabel="Use selected PDF"
            title="Bulletin PDF selector"
          />
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
