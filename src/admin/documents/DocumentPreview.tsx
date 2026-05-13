'use client';

import Box from '@mui/material/Box';
import DOMPurify from 'dompurify';
import { isValid, parseISO } from 'date-fns';
import { useMemo } from 'react';

import PageContentView from '../../components/pages/PageContentView';
import PageTitle from '../../components/pages/PageTitle';
import PostView from '../../components/posts/PostView';
import { AdminPagePreviewFrame } from '../AdminPagePreviewFrame';

import type { DocumentKind, PageDraft, PostDraft } from '../content/writableDocumentsContent';

function PreviewBody({ html }: { html: string }) {
  const sanitizedHtml = useMemo(() => DOMPurify.sanitize(html), [html]);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}

interface DocumentPreviewProps {
  draft: PageDraft | PostDraft;
  kind: DocumentKind;
}

function isPostDraft(draft: PageDraft | PostDraft): draft is PostDraft {
  return 'image' in draft && 'tags' in draft;
}

export function DocumentPreview({ draft, kind }: DocumentPreviewProps) {
  const previewBody =
    kind === 'page' || !isPostDraft(draft) ? (
      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%', width: '1200px' }}>
        <PageTitle title={draft.title || 'Untitled page'} />
        <PageContentView>
          <PreviewBody html={draft.body} />
        </PageContentView>
      </Box>
    ) : null;

  if (kind === 'page' || !isPostDraft(draft)) {
    return <AdminPagePreviewFrame>{previewBody}</AdminPagePreviewFrame>;
  }

  const parsedDate = parseISO(draft.date);
  const previewDate = isValid(parsedDate) ? parsedDate : new Date();
  const tags = draft.tags
    .split(/\r?\n|,/g)
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <AdminPagePreviewFrame>
      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%', width: '1200px' }}>
        <PostView title={draft.title || 'Untitled news post'} date={previewDate} image={draft.image} tags={tags}>
          <PreviewBody html={draft.body} />
        </PostView>
      </Box>
    </AdminPagePreviewFrame>
  );
}
