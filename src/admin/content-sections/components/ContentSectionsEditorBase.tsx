'use client';

import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';

import type { AdminRepoClient } from '../../services/adminTypes';
import type { ReactNode } from 'react';

interface SectionDefinition<SectionId extends string> {
  id: SectionId;
  label: string;
}

interface ContentSectionsEditorState<Content, Draft, SectionId extends string> {
  content: Content | null;
  draft: Draft | null;
  error: string | null;
  saveError: string | null;
  saveMessage: string | null;
  saveSectionId: SectionId | null;
  saveStatus: 'error' | 'idle' | 'saving' | 'success';
  status: 'error' | 'idle' | 'loading' | 'success';
}

interface ContentSectionsEditorBaseProps<SectionId extends string, Content, Draft extends Record<SectionId, unknown>> {
  createDraft: (content: Content) => Draft;
  failureMessage: string;
  introAlert?: ReactNode;
  loadContent: (repoClient: AdminRepoClient, sectionIds: SectionId[]) => Promise<Content>;
  loadingTitle: ReactNode;
  onSaved: () => Promise<void>;
  renderDialogs?: (args: {
    draft: Draft;
    onSaved: () => Promise<void>;
    repoClient: AdminRepoClient;
    updateDraft: <TKey extends SectionId>(sectionId: TKey, value: Draft[TKey]) => void;
  }) => ReactNode;
  renderSections: (args: {
    draft: Draft;
    renderSectionHeaderActions: (sectionId: SectionId) => ReactNode;
    shouldRenderSection: (sectionId: SectionId) => boolean;
    updateDraft: <TKey extends SectionId>(sectionId: TKey, value: Draft[TKey]) => void;
    visibleSectionIds: SectionId[];
  }) => ReactNode;
  repoClient: AdminRepoClient;
  saveSection: (
    repoClient: AdminRepoClient,
    input: { content: Content; draft: Draft; sectionId: SectionId }
  ) => Promise<Content>;
  sections: readonly SectionDefinition<SectionId>[];
  showIntroAlert?: boolean;
  visibleSections?: SectionId[];
}

function buildErrorMessage(error: unknown, failureMessage: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return failureMessage;
}

export function ContentSectionsEditorBase<SectionId extends string, Content, Draft extends Record<SectionId, unknown>>({
  createDraft,
  failureMessage,
  introAlert,
  loadContent,
  loadingTitle,
  onSaved,
  renderDialogs,
  renderSections,
  repoClient,
  saveSection,
  sections,
  showIntroAlert = true,
  visibleSections
}: ContentSectionsEditorBaseProps<SectionId, Content, Draft>) {
  const [editorState, setEditorState] = useState<ContentSectionsEditorState<Content, Draft, SectionId>>({
    content: null,
    draft: null,
    error: null,
    saveError: null,
    saveMessage: null,
    saveSectionId: null,
    saveStatus: 'idle',
    status: 'idle'
  });
  const visibleSectionIds = useMemo(
    () => visibleSections || sections.map((section) => section.id),
    [sections, visibleSections]
  );
  const visibleSectionIdsKey = visibleSectionIds.join('|');

  useEffect(() => {
    let cancelled = false;

    async function loadRequestedContent() {
      const requestedSectionIds = visibleSectionIdsKey ? (visibleSectionIdsKey.split('|') as SectionId[]) : [];

      setEditorState((currentState) => ({
        ...currentState,
        error: null,
        status: 'loading'
      }));

      try {
        const content = await loadContent(repoClient, requestedSectionIds);

        if (cancelled) {
          return;
        }

        setEditorState((currentState) => ({
          ...currentState,
          content,
          draft: createDraft(content),
          error: null,
          status: 'success'
        }));
      } catch (error) {
        if (cancelled) {
          return;
        }

        setEditorState((currentState) => ({
          ...currentState,
          error: buildErrorMessage(error, failureMessage),
          status: 'error'
        }));
      }
    }

    void loadRequestedContent();

    return () => {
      cancelled = true;
    };
  }, [createDraft, failureMessage, loadContent, repoClient, visibleSectionIdsKey]);

  function getSectionLabel(sectionId: SectionId) {
    return sections.find((section) => section.id === sectionId)?.label || sectionId;
  }

  function updateDraft<TKey extends SectionId>(sectionId: TKey, value: Draft[TKey]) {
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
        saveSectionId: sectionId,
        saveStatus: 'idle'
      };
    });
  }

  async function handleSave(sectionId: SectionId) {
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
      const content = await saveSection(repoClient, {
        content: editorState.content,
        draft: editorState.draft,
        sectionId
      });

      setEditorState((currentState) => ({
        ...currentState,
        content,
        draft: createDraft(content),
        saveError: null,
        saveMessage: `${getSectionLabel(sectionId)} saved.`,
        saveSectionId: sectionId,
        saveStatus: 'success',
        status: 'success'
      }));

      try {
        await onSaved();
      } catch (error) {
        setEditorState((currentState) => ({
          ...currentState,
          saveError: `Saved ${getSectionLabel(sectionId)}, but the summary did not refresh: ${buildErrorMessage(error, failureMessage)}`,
          saveSectionId: sectionId,
          saveStatus: 'error'
        }));
      }
    } catch (error) {
      setEditorState((currentState) => ({
        ...currentState,
        saveError: buildErrorMessage(error, failureMessage),
        saveSectionId: sectionId,
        saveStatus: 'error'
      }));
    }
  }

  if (editorState.status === 'loading' && !editorState.content) {
    return (
      <Stack spacing={2}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
          {loadingTitle}
        </Typography>
        <LinearProgress />
      </Stack>
    );
  }

  if (!editorState.content || !editorState.draft) {
    return editorState.error ? <Alert severity="error">{editorState.error}</Alert> : null;
  }

  const pristineDraft = createDraft(editorState.content);
  const isSaving = editorState.saveStatus === 'saving';
  const isDirty = (sectionId: SectionId) =>
    JSON.stringify(editorState.draft[sectionId]) !== JSON.stringify(pristineDraft[sectionId]);
  const shouldRenderSection = (sectionId: SectionId) => visibleSectionIds.includes(sectionId);

  function resetSection(sectionId: SectionId) {
    updateDraft(sectionId, pristineDraft[sectionId]);
  }

  function renderSectionHeaderActions(sectionId: SectionId) {
    const sectionIsDirty = isDirty(sectionId);
    const sectionIsSaving = editorState.saveSectionId === sectionId && isSaving;

    return (
      <div style={{ display: 'flex', gap: 8 }}>
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
          onClick={() => void handleSave(sectionId)}
          disabled={!sectionIsDirty || sectionIsSaving}
        >
          Save
        </Button>
      </div>
    );
  }

  return (
    <Stack spacing={2} sx={{ flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden', width: '100%' }}>
      {showIntroAlert && introAlert ? <Alert severity="info">{introAlert}</Alert> : null}
      {editorState.saveMessage ? <Alert severity="success">{editorState.saveMessage}</Alert> : null}
      {editorState.saveError ? <Alert severity="error">{editorState.saveError}</Alert> : null}
      {editorState.status === 'loading' ? <LinearProgress /> : null}
      {renderSections({
        draft: editorState.draft,
        renderSectionHeaderActions,
        shouldRenderSection,
        updateDraft,
        visibleSectionIds
      })}
      {renderDialogs ? renderDialogs({ draft: editorState.draft, onSaved, repoClient, updateDraft }) : null}
    </Stack>
  );
}
