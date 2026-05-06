'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  item,
  onSelect
}: {
  active: boolean;
  item: BulletinSummary;
  onSelect: (bulletinId: string) => void;
}) {
  return (
    <Button
      color="inherit"
      onClick={() => onSelect(item.id)}
      sx={{
        alignItems: 'flex-start',
        background: active
          ? 'linear-gradient(135deg, #7f232c 0%, #5c1820 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(250,245,238,0.92))',
        borderColor: active ? '#7f232c' : 'rgba(127, 35, 44, 0.16)',
        borderRadius: '4px',
        color: active ? '#ffffff' : '#222222',
        flexShrink: 0,
        justifyContent: 'flex-start',
        px: 2,
        py: 1.5,
        textAlign: 'left',
        textTransform: 'none',
        transition: 'transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease',
        '&:hover': {
          background: active ? 'linear-gradient(135deg, #6c1d26 0%, #49131a 100%)' : 'rgba(127, 35, 44, 0.05)',
          borderColor: '#7f232c',
          transform: 'translateY(-1px)'
        }
      }}
      variant={active ? 'contained' : 'outlined'}
    >
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
    </Button>
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
  const [editorState, setEditorState] = useState<BulletinEditorState>(INITIAL_EDITOR_STATE);
  const [draft, setDraft] = useState<BulletinDraft>(createEmptyBulletinDraft());
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [pdfPickerOpen, setPdfPickerOpen] = useState(false);
  const selectedBulletinIdRef = useRef(INITIAL_EDITOR_STATE.selectedBulletinId);

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
        const selectedBulletinId =
          selectedBulletinIdRef.current !== NEW_BULLETIN_ID &&
          summaries.some((summary) => summary.id === selectedBulletinIdRef.current)
            ? selectedBulletinIdRef.current
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
  const isSaving = editorState.saveStatus === 'saving';

  function selectBulletin(bulletinId: string) {
    setEditorState((currentState) => ({
      ...currentState,
      saveError: null,
      saveMessage: null,
      saveStatus: 'idle',
      selectedBulletinId: bulletinId
    }));
    setDraft(createDraftForSelection(editorState.content, bulletinId));
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
      setEditorState((currentState) => ({
        ...currentState,
        saveError: null,
        saveMessage: `${activeBulletin ? 'Bulletin metadata updated' : 'Bulletin created'} in the repository-backed admin draft.`,
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
      {editorState.saveMessage ? <Alert severity="success">{editorState.saveMessage}</Alert> : null}
      {editorState.saveError ? <Alert severity="error">{editorState.saveError}</Alert> : null}
      {editorState.status === 'loading' ? <LinearProgress /> : null}

      <Stack direction={{ xl: 'row', xs: 'column' }} spacing={2} alignItems="stretch" sx={{ flex: 1, minHeight: 0 }}>
        <Stack
          spacing={1.5}
          sx={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.84), rgba(250,245,238,0.92))',
            border: '1px solid rgba(127, 35, 44, 0.12)',
            borderRadius: '4px',
            boxShadow: '0 18px 40px rgba(57, 33, 24, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            height: { xl: '100%', xs: 'auto' },
            maxHeight: { xl: '100%', xs: 'none' },
            minHeight: 0,
            overflow: 'hidden',
            p: 2,
            width: { xl: 340, xs: '100%' }
          }}
        >
          <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5} justifyContent="space-between">
            <Button onClick={() => selectBulletin(NEW_BULLETIN_ID)} variant="contained" size="small" fullWidth>
              New bulletin
            </Button>
          </Stack>
          <Divider />
          {summaries.length === 0 ? <Alert severity="info">No bulletins are available yet.</Alert> : null}
          {summaries.length > 0 ? (
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                paddingTop: 0.25
              }}
            >
              {summaries.map((item) => (
                <BulletinListCard
                  key={item.id}
                  active={item.id === editorState.selectedBulletinId}
                  item={item}
                  onSelect={selectBulletin}
                />
              ))}
            </Box>
          ) : null}
        </Stack>

        <Stack spacing={2} sx={{ flex: 1, minHeight: 0, minWidth: 0 }}>
          <Stack
            spacing={2}
            sx={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(250,245,238,0.94))',
              border: '1px solid rgba(127, 35, 44, 0.12)',
              borderRadius: '4px',
              boxShadow: '0 18px 40px rgba(57, 33, 24, 0.08)',
              display: 'flex',
              flex: 1,
              minHeight: 0,
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                minHeight: 0,
                overflowY: { xl: 'auto', xs: 'visible' },
                p: { md: 2.5, xs: 2 }
              }}
            >
              <Stack spacing={2}>
                <Stack
                  direction={{ sm: 'row', xs: 'column' }}
                  spacing={1.5}
                  justifyContent="space-between"
                  alignItems={{ sm: 'flex-start', xs: 'stretch' }}
                >
                  <div>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
                      {activeBulletin ? 'Bulletin editor' : 'New bulletin'}
                    </Typography>
                    <Typography sx={{ color: '#616169', lineHeight: 1.7, mt: 1 }}>
                      Edit the JSON metadata that backs the bulletin archive and link it to a PDF stored in
                      public/bulletins.
                    </Typography>
                  </div>
                  {isDirty ? (
                    <Button
                      disabled={isSaving}
                      onClick={() => void handleSave()}
                      sx={{ flexShrink: 0 }}
                      variant="contained"
                    >
                      Save bulletin
                    </Button>
                  ) : null}
                </Stack>

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
                  <TextField
                    label="Linked PDF"
                    value={draft.pdf}
                    onChange={(event) => updateDraft({ pdf: event.target.value })}
                    helperText="Bulletin PDFs must stay under /bulletins."
                    fullWidth
                  />
                  <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5}>
                    <Button onClick={() => setPdfPickerOpen(true)} variant="outlined">
                      Browse bulletin files
                    </Button>
                    <Button onClick={() => setMediaLibraryOpen(true)} variant="outlined">
                      Manage media
                    </Button>
                    {draft.pdf ? (
                      <Button color="inherit" href={draft.pdf} rel="noreferrer" target="_blank" variant="outlined">
                        Open linked PDF
                      </Button>
                    ) : null}
                  </Stack>
                </Stack>

                <Divider />
                <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5} justifyContent="flex-end">
                  {!activeBulletin ? (
                    <Typography sx={{ color: '#6a5448', flex: 1, lineHeight: 1.6 }}>
                      A new bulletin metadata file will be created from the selected date.
                    </Typography>
                  ) : null}
                  <Button disabled={!isDirty || isSaving} onClick={() => setDraft(pristineDraft)} variant="outlined">
                    Reset
                  </Button>
                  <Button disabled={!isDirty || isSaving} onClick={() => void handleSave()} variant="contained">
                    Save bulletin
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Stack>

      <Dialog fullWidth maxWidth="lg" onClose={() => setMediaLibraryOpen(false)} open={mediaLibraryOpen}>
        <DialogTitle>Manage media</DialogTitle>
        <DialogContent dividers>
          <AdminMediaLibrary onChange={handleMediaChanged} repoClient={repoClient} title="Media library" />
        </DialogContent>
      </Dialog>

      <Dialog fullWidth maxWidth="lg" onClose={() => setPdfPickerOpen(false)} open={pdfPickerOpen}>
        <DialogTitle>Select bulletin PDF</DialogTitle>
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
            selectionLabel="Use selected bulletin file"
            title="Bulletin file browser"
          />
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
