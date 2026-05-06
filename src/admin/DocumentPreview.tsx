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

export function DocumentPreview({ draft, kind }: DocumentPreviewProps) {
  if (kind === 'page') {
    const pageDraft = draft as PageDraft;

    return (
      <AdminPagePreviewFrame framePadding="12px 0" maxWidth={DOCUMENT_PREVIEW_MAX_WIDTH}>
        <PageTitle title={pageDraft.title || 'Untitled page'} />
        <PageContentView>
          <PreviewBody html={pageDraft.body} />
        </PageContentView>
      </AdminPagePreviewFrame>
    );
  }

  const postDraft = draft as PostDraft;
  const parsedDate = parseISO(postDraft.date);
  const previewDate = isValid(parsedDate) ? parsedDate : new Date();
  const tags = postDraft.tags
    .split(/\r?\n|,/g)
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <AdminPagePreviewFrame framePadding="12px 0" maxWidth={DOCUMENT_PREVIEW_MAX_WIDTH}>
      <PostView title={postDraft.title || 'Untitled news post'} date={previewDate} image={postDraft.image} tags={tags}>
        <PreviewBody html={postDraft.body} />
      </PostView>
    </AdminPagePreviewFrame>
  );
}
