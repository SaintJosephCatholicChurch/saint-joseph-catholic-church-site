'use client';

import DOMPurify from 'dompurify';
import { isValid, parseISO } from 'date-fns';
import { useMemo } from 'react';

import PageContentView from '../components/pages/PageContentView';
import PageTitle from '../components/pages/PageTitle';
import PostView from '../components/posts/PostView';
import { AdminPagePreviewFrame } from './AdminPagePreviewFrame';

import type { DocumentKind, PageDraft, PostDraft } from './content/writableDocumentsContent';

const DOCUMENT_PREVIEW_MAX_WIDTH = 800;

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
  if (kind === 'page' || !isPostDraft(draft)) {
    return (
      <AdminPagePreviewFrame framePadding="12px 12px" maxWidth={DOCUMENT_PREVIEW_MAX_WIDTH}>
        <PageTitle title={draft.title || 'Untitled page'} />
        <PageContentView>
          <PreviewBody html={draft.body} />
        </PageContentView>
      </AdminPagePreviewFrame>
    );
  }

  const parsedDate = parseISO(draft.date);
  const previewDate = isValid(parsedDate) ? parsedDate : new Date();
  const tags = draft.tags
    .split(/\r?\n|,/g)
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <AdminPagePreviewFrame framePadding="12px 12px" maxWidth={DOCUMENT_PREVIEW_MAX_WIDTH}>
      <PostView title={draft.title || 'Untitled news post'} date={previewDate} image={draft.image} tags={tags}>
        <PreviewBody html={draft.body} />
      </PostView>
    </AdminPagePreviewFrame>
  );
}
