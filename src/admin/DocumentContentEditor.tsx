'use client';

import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Alert from '@mui/material/Alert';
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

import { AdminSelectableCard, AdminSurfacePanel } from './components/AdminCards';
import {
  AdminCompactActionBar,
  AdminDetailTabs,
  AdminListSidebar,
  AdminRecordHeader,
  AdminRecordWorkspacePanel,
  AdminSidebarListBody,
  AdminStatusStack
} from './components/AdminWorkspace';
import { AdminHtmlEditor } from './AdminHtmlEditor';
import { AdminImagePathField } from './AdminImagePathField';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { DocumentPreview } from './DocumentPreview';
import {
  createDocumentSummaries,
  createPageDocument,
  createPageDraft,
  createPostDocument,
  createPostDraft,
  ensureDocumentLoaded,
  loadDocumentContent,
  savePageDocument,
  savePostDocument,
  type DocumentContent,
  type DocumentKind,
  type DocumentSummary,
  type PageDraft,
  type PostDraft
} from './content/writableDocumentsContent';

import type { MediaAsset } from './content/writableBulletinsMediaContent';
import type { AdminRepoClient } from './services/adminTypes';

interface DocumentContentEditorProps {
  allowedKinds?: DocumentKind[];
  onSaved: () => Promise<void>;
  repoClient: AdminRepoClient;
  showIntroAlert?: boolean;
}

interface DocumentEditorState {
  content: DocumentContent | null;
  error: string | null;
  saveError: string | null;
  saveMessage: string | null;
  saveStatus: 'error' | 'idle' | 'saving' | 'success';
  selectedDocumentId: string | null;
  status: 'error' | 'idle' | 'loading' | 'success';
}

const INITIAL_EDITOR_STATE: DocumentEditorState = {
  content: null,
  error: null,
  saveError: null,
  saveMessage: null,
  saveStatus: 'idle',
  selectedDocumentId: null,
  status: 'idle'
};

function buildErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'The document editor failed to load.';
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface CreateDialogState {
  date: string;
  error: string | null;
  open: boolean;
  saving: boolean;
  slug: string;
  slugEdited: boolean;
  title: string;
}

const CLOSED_CREATE_DIALOG: CreateDialogState = {
  date: '',
  error: null,
  open: false,
  saving: false,
  slug: '',
  slugEdited: false,
  title: ''
};

const DOCUMENT_SELECTION_QUERY_PARAM = 'entry';

function DocumentListCard({
  active,
  compact = false,
  item,
  onSelect
}: {
  active: boolean;
  compact?: boolean;
  item: DocumentSummary;
  onSelect: (documentId: string) => void;
}) {
  const metadata = [
    item.kind === 'page' ? `/${item.slug}` : `/news/${item.slug}`,
    item.kind === 'post' ? formatDate(item.date) : null
  ]
    .filter(Boolean)
    .join(' • ');

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
          direction={{ sm: 'row', xs: 'column' }}
          spacing={{ sm: 1.25, xs: 0.25 }}
          alignItems={{ sm: 'center', xs: 'flex-start' }}
          justifyContent="space-between"
          sx={{ minWidth: 0, overflow: 'hidden', width: '100%' }}
        >
          <Typography
            sx={{
              flex: 1,
              fontWeight: 700,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {item.title}
          </Typography>
          <Typography
            sx={{
              color: active ? 'rgba(255,255,255,0.8)' : '#6a5448',
              flexShrink: 0,
              fontSize: '0.76rem',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {metadata}
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={0.25} sx={{ minWidth: 0, overflow: 'hidden', width: '100%' }}>
          <Typography sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.title}
          </Typography>
          <Typography
            sx={{
              color: active ? 'rgba(255,255,255,0.8)' : '#616169',
              fontSize: '0.82rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {item.kind === 'page' ? `/${item.slug}` : `/news/${item.slug}`}
          </Typography>
          {item.kind === 'post' ? (
            <Typography
              sx={{
                color: active ? 'rgba(255,255,255,0.7)' : '#9b8b7e',
                fontSize: '0.78rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {formatDate(item.date)}
            </Typography>
          ) : null}
        </Stack>
      )}
    </AdminSelectableCard>
  );
}

export function DocumentContentEditor({
  allowedKinds,
  onSaved,
  repoClient,
  showIntroAlert = true
}: DocumentContentEditorProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isCompactLayout = useMediaQuery(theme.breakpoints.down('xl'));
  const isMobileRecordLayout = useMediaQuery(theme.breakpoints.down('md'));
  const routedDocumentId = searchParams.get(DOCUMENT_SELECTION_QUERY_PARAM);
  const [editorState, setEditorState] = useState<DocumentEditorState>(INITIAL_EDITOR_STATE);
  const [filterTerm, setFilterTerm] = useState('');
  const [mediaPickerMode, setMediaPickerMode] = useState<'body-file' | 'body-image' | 'hero-image' | null>(null);
  const [mobileDetailPanel, setMobileDetailPanel] = useState<'editor' | 'preview'>('editor');
  const [pendingEditorAsset, setPendingEditorAsset] = useState<MediaAsset | null>(null);
  const [pageDrafts, setPageDrafts] = useState<Record<string, PageDraft>>({});
  const [postDrafts, setPostDrafts] = useState<Record<string, PostDraft>>({});
  const [createDialog, setCreateDialog] = useState<CreateDialogState>(CLOSED_CREATE_DIALOG);

  const visibleKinds = useMemo<DocumentKind[]>(
    () => (allowedKinds && allowedKinds.length > 0 ? allowedKinds : ['page', 'post']),
    [allowedKinds]
  );
  const visibleKindsKey = visibleKinds.join('|');
  const routedDocumentIdRef = useRef(routedDocumentId);
  const visibleKindsRef = useRef(visibleKinds);

  useEffect(() => {
    routedDocumentIdRef.current = routedDocumentId;
  }, [routedDocumentId]);

  useEffect(() => {
    visibleKindsRef.current = visibleKinds;
  }, [visibleKinds]);

  function syncDraftsFromContent(content: DocumentContent) {
    setPageDrafts(
      Object.fromEntries(content.pages.map((document) => [`page:${document.path}`, createPageDraft(document)]))
    );
    setPostDrafts(
      Object.fromEntries(content.posts.map((document) => [`post:${document.path}`, createPostDraft(document)]))
    );
  }

  const buildSelectionHref = useCallback(
    (documentId: string | null) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (documentId) {
        nextParams.set(DOCUMENT_SELECTION_QUERY_PARAM, documentId);
      } else {
        nextParams.delete(DOCUMENT_SELECTION_QUERY_PARAM);
      }

      const query = nextParams.toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [pathname, searchParams]
  );

  const replaceSelectionInUrl = useCallback(
    (documentId: string | null) => {
      router.replace(buildSelectionHref(documentId), { scroll: false });
    },
    [buildSelectionHref, router]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      setEditorState((currentState) => ({
        ...currentState,
        error: null,
        status: 'loading'
      }));

      try {
        const content = await loadDocumentContent(repoClient);
        const summaries = createDocumentSummaries(content);
        const currentVisibleKinds = visibleKindsRef.current;
        const selectedDocumentId =
          currentSelectionRef(summaries) ||
          summaries.find((summary) => currentVisibleKinds.includes(summary.kind))?.id ||
          null;

        if (cancelled) {
          return;
        }

        syncDraftsFromContent(content);
        setEditorState((currentState) => ({
          ...currentState,
          content,
          error: null,
          selectedDocumentId,
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

    function currentSelectionRef(summaries: DocumentSummary[]) {
      const currentRoutedDocumentId = routedDocumentIdRef.current;
      const currentVisibleKinds = visibleKindsRef.current;

      if (
        currentRoutedDocumentId &&
        summaries.some(
          (summary) => summary.id === currentRoutedDocumentId && currentVisibleKinds.includes(summary.kind)
        )
      ) {
        return currentRoutedDocumentId;
      }

      return null;
    }

    void loadContent();

    return () => {
      cancelled = true;
    };
  }, [repoClient, visibleKindsKey]);

  const summaries = useMemo(
    () => (editorState.content ? createDocumentSummaries(editorState.content) : []),
    [editorState.content]
  );
  const visibleSummaries = useMemo(
    () => summaries.filter((summary) => visibleKinds.includes(summary.kind)),
    [summaries, visibleKinds]
  );
  const hasVisibleSummaries = visibleSummaries.length > 0;
  const normalizedFilterTerm = filterTerm.trim().toLowerCase();
  const filterTokens = normalizedFilterTerm ? normalizedFilterTerm.split(/\s+/).filter(Boolean) : [];
  const filteredSummaries = useMemo(
    () =>
      visibleSummaries.filter((summary) => {
        if (filterTokens.length === 0) {
          return true;
        }

        const haystack = [summary.title, summary.slug, summary.path, summary.date].join(' ').toLowerCase();
        return filterTokens.every((token) => haystack.includes(token));
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterTokens.join('\x00'), visibleSummaries]
  );
  const preferredSelectedDocumentId = routedDocumentId || editorState.selectedDocumentId;
  const activeSummary =
    filteredSummaries.find((summary) => summary.id === preferredSelectedDocumentId) ||
    (!isCompactLayout || Boolean(routedDocumentId) ? filteredSummaries[0] || null : null);
  const activePage =
    activeSummary?.kind === 'page'
      ? editorState.content?.pages.find((document) => `page:${document.path}` === activeSummary.id) || null
      : null;
  const activePageDraft = activeSummary?.kind === 'page' ? pageDrafts[activeSummary.id] || null : null;
  const activePost =
    activeSummary?.kind === 'post'
      ? editorState.content?.posts.find((document) => `post:${document.path}` === activeSummary.id) || null
      : null;
  const activePostDraft = activeSummary?.kind === 'post' ? postDrafts[activeSummary.id] || null : null;
  const activeDraft =
    activeSummary?.kind === 'page' ? activePageDraft : activeSummary?.kind === 'post' ? activePostDraft : null;
  const pristineDraft =
    activeSummary?.kind === 'page' && activePage
      ? createPageDraft(activePage)
      : activeSummary?.kind === 'post' && activePost
        ? createPostDraft(activePost)
        : null;
  const isDirty = activeDraft && pristineDraft ? JSON.stringify(activeDraft) !== JSON.stringify(pristineDraft) : false;
  const isSaving = editorState.saveStatus === 'saving';
  const showListViewOnly = isCompactLayout && !routedDocumentId;
  const showDenseListCards = isCompactLayout;
  const showActiveListSelection = !isCompactLayout || Boolean(routedDocumentId);
  useEffect(() => {
    if (!editorState.content || !activeSummary) {
      return;
    }

    const activeDocument = activeSummary.kind === 'page' ? activePage : activePost;
    if (!activeDocument || activeDocument.body) {
      return;
    }

    let cancelled = false;

    async function hydrateDocument() {
      try {
        const nextContent = await ensureDocumentLoaded(repoClient, editorState.content, activeSummary.id);

        if (cancelled || nextContent === editorState.content) {
          return;
        }

        syncDraftsFromContent(nextContent);
        setEditorState((currentState) => ({
          ...currentState,
          content: nextContent,
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

    void hydrateDocument();

    return () => {
      cancelled = true;
    };
  }, [activePage, activePost, activeSummary, editorState.content, repoClient]);

  const documentEditorActions = (
    <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ flexShrink: 0 }}>
      <IconButton
        aria-label="Reset"
        title="Reset"
        onClick={resetActiveDraft}
        disabled={!isDirty || isSaving}
        size="small"
      >
        <RestartAltIcon fontSize="small" />
      </IconButton>
      <Button variant="contained" onClick={() => void handleSave()} disabled={!isDirty || isSaving}>
        Save
      </Button>
    </Stack>
  );

  function openCreateDialog() {
    const today = new Date().toISOString().slice(0, 10);
    setCreateDialog({
      date: today,
      error: null,
      open: true,
      saving: false,
      slug: '',
      slugEdited: false,
      title: ''
    });
  }

  function handleCreateTitleChange(title: string) {
    setCreateDialog((current) => ({
      ...current,
      title,
      slug: current.slugEdited ? current.slug : slugify(title)
    }));
  }

  function handleCreateSlugChange(slug: string) {
    setCreateDialog((current) => ({ ...current, slug, slugEdited: true }));
  }

  async function handleCreate() {
    if (!repoClient || visibleKinds.length === 0) {
      return;
    }

    const kind = visibleKinds[0];

    setCreateDialog((current) => ({ ...current, error: null, saving: true }));

    try {
      const result: { content: DocumentContent; newId: string } =
        kind === 'page'
          ? await createPageDocument(repoClient, {
              content: editorState.content,
              date: createDialog.date,
              slug: createDialog.slug,
              title: createDialog.title
            })
          : await createPostDocument(repoClient, {
              content: editorState.content,
              date: createDialog.date,
              slug: createDialog.slug,
              title: createDialog.title
            });

      syncDraftsFromContent(result.content);
      setEditorState((current) => ({
        ...current,
        content: result.content,
        saveError: null,
        saveMessage: `${kind === 'page' ? 'Page' : 'News post'} created successfully.`,
        saveStatus: 'success',
        selectedDocumentId: result.newId,
        status: 'success'
      }));
      setMobileDetailPanel('editor');
      replaceSelectionInUrl(result.newId);
      setCreateDialog(CLOSED_CREATE_DIALOG);

      try {
        await onSaved();
      } catch {
        // summary refresh failed, non-critical
      }
    } catch (error) {
      setCreateDialog((current) => ({ ...current, error: buildErrorMessage(error), saving: false }));
    }
  }

  function openMediaPicker(forImage: boolean) {
    setMediaPickerMode(forImage ? 'body-image' : 'body-file');
  }

  function handleMediaAssetSelected(asset: MediaAsset) {
    if (mediaPickerMode === 'hero-image') {
      updateActivePostDraft({ image: asset.publicPath });
      setMediaPickerMode(null);
      return;
    }

    setPendingEditorAsset(asset);
    setMediaPickerMode(null);
  }

  function handleEditorAssetInserted() {
    setPendingEditorAsset(null);
  }

  function selectDocument(documentId: string) {
    setMobileDetailPanel('editor');
    setEditorState((currentState) => ({
      ...currentState,
      saveError: null,
      saveMessage: null,
      saveStatus: 'idle',
      selectedDocumentId: documentId
    }));
    replaceSelectionInUrl(documentId);
  }

  function returnToDocumentList() {
    setMobileDetailPanel('editor');
    replaceSelectionInUrl(null);
  }

  function updateActivePageDraft(nextValue: Partial<PageDraft>) {
    if (!activeSummary || activeSummary.kind !== 'page') {
      return;
    }

    setPageDrafts((currentDrafts) => ({
      ...currentDrafts,
      [activeSummary.id]: {
        ...currentDrafts[activeSummary.id],
        ...nextValue
      }
    }));
    setEditorState((currentState) => ({
      ...currentState,
      saveError: null,
      saveMessage: null,
      saveStatus: 'idle'
    }));
  }

  function updateActivePostDraft(nextValue: Partial<PostDraft>) {
    if (!activeSummary || activeSummary.kind !== 'post') {
      return;
    }

    setPostDrafts((currentDrafts) => ({
      ...currentDrafts,
      [activeSummary.id]: {
        ...currentDrafts[activeSummary.id],
        ...nextValue
      }
    }));
    setEditorState((currentState) => ({
      ...currentState,
      saveError: null,
      saveMessage: null,
      saveStatus: 'idle'
    }));
  }

  function resetActiveDraft() {
    if (!activeSummary || !pristineDraft) {
      return;
    }

    if (activeSummary.kind === 'page' && activePage && activePageDraft) {
      setPageDrafts((currentDrafts) => ({
        ...currentDrafts,
        [activeSummary.id]: createPageDraft(activePage)
      }));
    } else if (activeSummary.kind === 'post' && activePost && activePostDraft) {
      setPostDrafts((currentDrafts) => ({
        ...currentDrafts,
        [activeSummary.id]: createPostDraft(activePost)
      }));
    }

    setEditorState((currentState) => ({
      ...currentState,
      saveError: null,
      saveMessage: null,
      saveStatus: 'idle'
    }));
  }

  async function handleSave() {
    if (!activeSummary || !activeDraft || !editorState.content) {
      return;
    }

    setEditorState((currentState) => ({
      ...currentState,
      saveError: null,
      saveMessage: null,
      saveStatus: 'saving'
    }));

    try {
      let content = editorState.content;

      if (activeSummary.kind === 'page' && activePage && activePageDraft) {
        content = await savePageDocument(repoClient, {
          content,
          document: activePage,
          draft: activePageDraft
        });
      }

      if (activeSummary.kind === 'post' && activePost && activePostDraft) {
        content = await savePostDocument(repoClient, {
          content,
          document: activePost,
          draft: activePostDraft
        });
      }

      syncDraftsFromContent(content);
      setEditorState((currentState) => ({
        ...currentState,
        content,
        saveError: null,
        saveMessage: `${activeSummary.kind === 'page' ? 'Page' : 'News post'} saved.`,
        saveStatus: 'success',
        status: 'success'
      }));

      try {
        await onSaved();
      } catch (error) {
        setEditorState((currentState) => ({
          ...currentState,
          saveError: `Saved the document, but the summary did not refresh: ${buildErrorMessage(error)}`,
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

  useEffect(() => {
    if (!editorState.content || !routedDocumentId) {
      return;
    }

    if (!visibleSummaries.some((summary) => summary.id === routedDocumentId)) {
      return;
    }

    if (routedDocumentId === editorState.selectedDocumentId) {
      return;
    }

    setEditorState((currentState) => ({
      ...currentState,
      selectedDocumentId: routedDocumentId
    }));
  }, [editorState.content, editorState.selectedDocumentId, routedDocumentId, visibleSummaries]);

  useEffect(() => {
    if (filteredSummaries.length === 0) {
      return;
    }

    if (filteredSummaries.some((summary) => summary.id === editorState.selectedDocumentId)) {
      return;
    }

    const fallbackDocumentId = filteredSummaries[0].id;

    setEditorState((currentState) => ({
      ...currentState,
      selectedDocumentId: fallbackDocumentId
    }));

    if (routedDocumentId) {
      replaceSelectionInUrl(fallbackDocumentId);
    }
  }, [editorState.selectedDocumentId, filteredSummaries, replaceSelectionInUrl, routedDocumentId]);

  if (editorState.status === 'loading' && !editorState.content) {
    return (
      <Stack spacing={2}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
          Loading document editor
        </Typography>
        <LinearProgress />
      </Stack>
    );
  }

  if (!editorState.content || !hasVisibleSummaries) {
    const createDialogJsx = (
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={() => !createDialog.saving && setCreateDialog(CLOSED_CREATE_DIALOG)}
        open={createDialog.open}
      >
        <DialogTitle>New {visibleKinds[0] === 'page' ? 'Page' : 'Post'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            {createDialog.error ? <Alert severity="error">{createDialog.error}</Alert> : null}
            <TextField
              disabled={createDialog.saving}
              fullWidth
              label="Title"
              onChange={(e) => handleCreateTitleChange(e.target.value)}
              value={createDialog.title}
            />
            <TextField
              disabled={createDialog.saving}
              fullWidth
              helperText="Used in the URL"
              label="Slug"
              onChange={(e) => handleCreateSlugChange(e.target.value)}
              value={createDialog.slug}
            />
            <TextField
              disabled={createDialog.saving}
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Publish date"
              onChange={(e) => setCreateDialog((c) => ({ ...c, date: e.target.value }))}
              type="date"
              value={createDialog.date}
            />
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button
                disabled={createDialog.saving}
                onClick={() => setCreateDialog(CLOSED_CREATE_DIALOG)}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                disabled={
                  createDialog.saving ||
                  !createDialog.title.trim() ||
                  !createDialog.slug.trim() ||
                  !createDialog.date.trim()
                }
                onClick={() => void handleCreate()}
                variant="contained"
              >
                {createDialog.saving ? 'Creating...' : 'Create'}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    );

    return (
      <Stack spacing={2}>
        {editorState.error ? <Alert severity="error">{editorState.error}</Alert> : null}
        {editorState.content && visibleKinds.length === 1 ? (
          <>
            <Alert severity="info">
              No {visibleKinds[0] === 'page' ? 'pages' : 'news posts'} found. Create one to get started.
            </Alert>
            <Button fullWidth onClick={openCreateDialog} size="small" variant="contained">
              New {visibleKinds[0] === 'page' ? 'Page' : 'Post'}
            </Button>
          </>
        ) : null}
        {createDialogJsx}
      </Stack>
    );
  }

  return (
    <Stack spacing={2} sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <AdminStatusStack
        errorMessage={editorState.saveError}
        loading={editorState.status === 'loading'}
        successMessage={editorState.saveMessage}
      >
        {showIntroAlert ? (
          <Stack spacing={2}>
            <Alert severity="info">
              Phase 8 keeps pages and news on the existing frontmatter-plus-body contract, but this admin path only
              supports HTML body editing. MDX imports, JSX components, and expression blocks are rejected on save.
            </Alert>
            <Alert severity="info">
              Phase 9 now adds shared-media browsing, upload, and direct asset insertion for both document bodies and
              news hero images.
            </Alert>
          </Stack>
        ) : null}
      </AdminStatusStack>

      <Stack direction={{ xl: 'row', xs: 'column' }} spacing={2} alignItems="stretch" sx={{ flex: 1, minHeight: 0 }}>
        {!isCompactLayout || showListViewOnly ? (
          <AdminListSidebar
            actions={
              visibleKinds.length === 1 ? (
                <Button fullWidth onClick={openCreateDialog} size="small" variant="contained">
                  New {visibleKinds[0] === 'page' ? 'Page' : 'Post'}
                </Button>
              ) : null
            }
            filter={
              <TextField
                label="Filter entries"
                size="small"
                value={filterTerm}
                onChange={(event) => setFilterTerm(event.target.value)}
                fullWidth
              />
            }
            summaryLabel="Entries"
            summaryValue={filteredSummaries.length}
            emptyState={
              filteredSummaries.length === 0 ? (
                <Alert severity="info">No entries match the current filter.</Alert>
              ) : null
            }
            sx={{
              height: { xl: '100%', xs: 'auto' },
              maxHeight: { xl: '100%', xs: 'none' },
              pb: isCompactLayout ? 2 : 0,
              width: { xl: 360, xs: '100%' }
            }}
          >
            {filteredSummaries.length > 0 ? (
              <AdminSidebarListBody dense={showDenseListCards}>
                {filteredSummaries.map((item) => (
                  <DocumentListCard
                    key={item.id}
                    active={showActiveListSelection && item.id === activeSummary?.id}
                    compact={showDenseListCards}
                    item={item}
                    onSelect={selectDocument}
                  />
                ))}
              </AdminSidebarListBody>
            ) : null}
          </AdminListSidebar>
        ) : null}

        {!showListViewOnly ? (
          activeSummary && activeDraft ? (
            <Stack spacing={2} sx={{ flex: 1, minHeight: 0, minWidth: 0 }}>
              {isCompactLayout ? (
                <Stack spacing={1.5}>
                  <AdminCompactActionBar actions={documentEditorActions} onBack={returnToDocumentList} />
                  {isMobileRecordLayout ? (
                    <AdminDetailTabs
                      value={mobileDetailPanel}
                      onChange={(nextPanel) => setMobileDetailPanel(nextPanel as 'editor' | 'preview')}
                      tabs={[
                        { label: 'Editor', value: 'editor' },
                        { label: 'Preview', value: 'preview' }
                      ]}
                    />
                  ) : null}
                </Stack>
              ) : null}

              {isMobileRecordLayout ? (
                mobileDetailPanel === 'editor' ? (
                  <AdminRecordWorkspacePanel panelSx={{ minWidth: 0 }} contentSx={{ overflowY: 'visible' }}>
                    <Stack spacing={2}>
                      <AdminRecordHeader
                        actions={!isCompactLayout ? documentEditorActions : null}
                        title={activeSummary.kind === 'page' ? 'Page editor' : 'News editor'}
                      />

                      {activeSummary.kind === 'page' ? (
                        <Stack spacing={2}>
                          <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
                            <TextField
                              label="Slug"
                              value={activePageDraft?.slug || ''}
                              onChange={(event) => updateActivePageDraft({ slug: event.target.value })}
                              fullWidth
                            />
                            <TextField
                              label="Publish date"
                              type="date"
                              value={activePageDraft?.date || ''}
                              onChange={(event) => updateActivePageDraft({ date: event.target.value })}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                            />
                          </Stack>
                          <TextField
                            label="Title"
                            value={activePageDraft?.title || ''}
                            onChange={(event) => updateActivePageDraft({ title: event.target.value })}
                            fullWidth
                          />
                          <Stack spacing={1}>
                            <Typography sx={{ fontWeight: 700 }}>Body</Typography>
                            <AdminHtmlEditor
                              assetToInsert={pendingEditorAsset}
                              onAssetInserted={handleEditorAssetInserted}
                              value={activePageDraft?.body || ''}
                              onChange={(nextValue) => updateActivePageDraft({ body: nextValue })}
                              onOpenMediaLibrary={openMediaPicker}
                            />
                          </Stack>
                        </Stack>
                      ) : (
                        <Stack spacing={2}>
                          <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
                            <TextField label="Slug" value={activePostDraft?.slug || ''} fullWidth disabled />
                            <TextField
                              label="Publish date"
                              type="date"
                              value={activePostDraft?.date || ''}
                              onChange={(event) => updateActivePostDraft({ date: event.target.value })}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                            />
                          </Stack>
                          <TextField
                            label="Title"
                            value={activePostDraft?.title || ''}
                            onChange={(event) => updateActivePostDraft({ title: event.target.value })}
                            fullWidth
                          />
                          <Stack direction={{ xs: 'column' }} spacing={2}>
                            <Stack spacing={1.5} sx={{ flex: 1 }} width="100%">
                              <AdminImagePathField
                                buttonLabel="Select image"
                                onSelectImage={() => setMediaPickerMode('hero-image')}
                                previewAlt={activePostDraft?.title || 'Hero image preview'}
                                value={activePostDraft?.image || ''}
                              />
                            </Stack>
                            <TextField
                              label="Tags"
                              value={activePostDraft?.tags || ''}
                              onChange={(event) => updateActivePostDraft({ tags: event.target.value })}
                              helperText="Separate tags with commas or line breaks."
                              fullWidth
                            />
                          </Stack>
                          <Stack spacing={1}>
                            <Typography sx={{ fontWeight: 700 }}>Body</Typography>
                            <AdminHtmlEditor
                              assetToInsert={pendingEditorAsset}
                              onAssetInserted={handleEditorAssetInserted}
                              value={activePostDraft?.body || ''}
                              onChange={(nextValue) => updateActivePostDraft({ body: nextValue })}
                              onOpenMediaLibrary={openMediaPicker}
                            />
                          </Stack>
                        </Stack>
                      )}
                    </Stack>
                  </AdminRecordWorkspacePanel>
                ) : (
                  <Stack
                    spacing={1.5}
                    sx={{
                      flex: 1,
                      minHeight: 0,
                      minWidth: 0,
                      overflow: 'hidden',
                      width: '100%'
                    }}
                  >
                    <DocumentPreview draft={activeDraft} kind={activeSummary.kind} />
                  </Stack>
                )
              ) : (
                <Stack direction="row" spacing={2} sx={{ flex: 1, minHeight: 0, minWidth: 0 }} alignItems="stretch">
                  <AdminRecordWorkspacePanel
                    panelSx={{
                      flex: { md: '0 0 430px', xs: '1 1 auto' },
                      height: '100%',
                      minWidth: 0,
                      width: { md: 430, xs: '100%' }
                    }}
                    contentSx={{ overflowY: 'auto' }}
                  >
                    <Stack spacing={2}>
                      <AdminRecordHeader
                        actions={!isCompactLayout ? documentEditorActions : null}
                        title={activeSummary.kind === 'page' ? 'Page editor' : 'News editor'}
                      />

                      {activeSummary.kind === 'page' ? (
                        <Stack spacing={2}>
                          <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
                            <TextField
                              label="Slug"
                              value={activePageDraft?.slug || ''}
                              onChange={(event) => updateActivePageDraft({ slug: event.target.value })}
                              fullWidth
                            />
                            <TextField
                              label="Publish date"
                              type="date"
                              value={activePageDraft?.date || ''}
                              onChange={(event) => updateActivePageDraft({ date: event.target.value })}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                            />
                          </Stack>
                          <TextField
                            label="Title"
                            value={activePageDraft?.title || ''}
                            onChange={(event) => updateActivePageDraft({ title: event.target.value })}
                            fullWidth
                          />
                          <Stack spacing={1}>
                            <Typography sx={{ fontWeight: 700 }}>Body</Typography>
                            <AdminHtmlEditor
                              assetToInsert={pendingEditorAsset}
                              onAssetInserted={handleEditorAssetInserted}
                              value={activePageDraft?.body || ''}
                              onChange={(nextValue) => updateActivePageDraft({ body: nextValue })}
                              onOpenMediaLibrary={openMediaPicker}
                            />
                          </Stack>
                        </Stack>
                      ) : (
                        <Stack spacing={2}>
                          <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
                            <TextField label="Slug" value={activePostDraft?.slug || ''} fullWidth disabled />
                            <TextField
                              label="Publish date"
                              type="date"
                              value={activePostDraft?.date || ''}
                              onChange={(event) => updateActivePostDraft({ date: event.target.value })}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                            />
                          </Stack>
                          <TextField
                            label="Title"
                            value={activePostDraft?.title || ''}
                            onChange={(event) => updateActivePostDraft({ title: event.target.value })}
                            fullWidth
                          />
                          <Stack direction={{ xs: 'column' }} spacing={2}>
                            <Stack spacing={1.5} sx={{ flex: 1 }} width="100%">
                              <AdminImagePathField
                                buttonLabel="Select image"
                                onSelectImage={() => setMediaPickerMode('hero-image')}
                                previewAlt={activePostDraft?.title || 'Hero image preview'}
                                value={activePostDraft?.image || ''}
                              />
                            </Stack>
                            <TextField
                              label="Tags"
                              value={activePostDraft?.tags || ''}
                              onChange={(event) => updateActivePostDraft({ tags: event.target.value })}
                              helperText="Separate tags with commas or line breaks."
                              fullWidth
                            />
                          </Stack>
                          <Stack spacing={1}>
                            <Typography sx={{ fontWeight: 700 }}>Body</Typography>
                            <AdminHtmlEditor
                              assetToInsert={pendingEditorAsset}
                              onAssetInserted={handleEditorAssetInserted}
                              value={activePostDraft?.body || ''}
                              onChange={(nextValue) => updateActivePostDraft({ body: nextValue })}
                              onOpenMediaLibrary={openMediaPicker}
                            />
                          </Stack>
                        </Stack>
                      )}
                    </Stack>
                  </AdminRecordWorkspacePanel>

                  <Stack
                    spacing={1.5}
                    sx={{
                      flex: 1,
                      height: '100%',
                      minHeight: 0,
                      minWidth: 0,
                      overflow: 'hidden',
                      width: '100%'
                    }}
                  >
                    <DocumentPreview draft={activeDraft} kind={activeSummary.kind} />
                  </Stack>
                </Stack>
              )}
            </Stack>
          ) : (
            <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
              <AdminSurfacePanel
                spacing={2}
                sx={{
                  p: { md: 2.5, xs: 2 }
                }}
              >
                <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
                  No matching entries
                </Typography>
                <Typography sx={{ color: '#616169', lineHeight: 1.7 }}>
                  Adjust the filter to show an existing page or post. The list stays available so you can refine the
                  current search without losing the editor layout.
                </Typography>
              </AdminSurfacePanel>
            </Stack>
          )
        ) : null}
      </Stack>

      <Dialog fullWidth maxWidth="lg" onClose={() => setMediaPickerMode(null)} open={Boolean(mediaPickerMode)}>
        <DialogTitle>
          {mediaPickerMode === 'hero-image'
            ? 'Select image'
            : mediaPickerMode === 'body-image'
              ? 'Insert image'
              : 'Insert file'}
        </DialogTitle>
        <DialogContent dividers>
          <AdminMediaLibrary
            allowedFolderIds={['shared']}
            onChange={onSaved}
            onSelectAsset={handleMediaAssetSelected}
            repoClient={repoClient}
            selectionFilter={mediaPickerMode === 'hero-image' || mediaPickerMode === 'body-image' ? 'images' : 'all'}
            selectionLabel={mediaPickerMode === 'hero-image' ? 'Use selected image' : 'Insert selected asset'}
            title={
              mediaPickerMode === 'hero-image' || mediaPickerMode === 'body-image' ? 'Select image' : 'Select file'
            }
          />
        </DialogContent>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={() => !createDialog.saving && setCreateDialog(CLOSED_CREATE_DIALOG)}
        open={createDialog.open}
      >
        <DialogTitle>New {visibleKinds[0] === 'page' ? 'Page' : 'Post'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            {createDialog.error ? <Alert severity="error">{createDialog.error}</Alert> : null}
            <TextField
              disabled={createDialog.saving}
              fullWidth
              label="Title"
              onChange={(e) => handleCreateTitleChange(e.target.value)}
              value={createDialog.title}
            />
            <TextField
              disabled={createDialog.saving}
              fullWidth
              helperText="Used in the URL"
              label="Slug"
              onChange={(e) => handleCreateSlugChange(e.target.value)}
              value={createDialog.slug}
            />
            <TextField
              disabled={createDialog.saving}
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Publish date"
              onChange={(e) => setCreateDialog((c) => ({ ...c, date: e.target.value }))}
              type="date"
              value={createDialog.date}
            />
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button
                disabled={createDialog.saving}
                onClick={() => setCreateDialog(CLOSED_CREATE_DIALOG)}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                disabled={
                  createDialog.saving ||
                  !createDialog.title.trim() ||
                  !createDialog.slug.trim() ||
                  !createDialog.date.trim()
                }
                onClick={() => void handleCreate()}
                variant="contained"
              >
                {createDialog.saving ? 'Creating...' : 'Create'}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
