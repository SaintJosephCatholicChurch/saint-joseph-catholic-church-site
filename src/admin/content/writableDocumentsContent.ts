import {
  ChurchSiteContentRepository,
  SITE_CONTENT_PATHS,
  type AdminPageFrontmatter,
  type AdminPostFrontmatter,
  type StoredDocument
} from './contentRepository';

import type { AdminRepoClient } from '../services/adminTypes';

export type DocumentKind = 'page' | 'post';

export interface PageDraft {
  body: string;
  date: string;
  slug: string;
  title: string;
}

export interface PostDraft {
  body: string;
  date: string;
  image: string;
  slug: string;
  tags: string;
  title: string;
}

export interface DocumentSummary {
  date: string;
  id: string;
  kind: DocumentKind;
  path: string;
  slug: string;
  title: string;
}

export interface DocumentContent {
  loadedAt: string;
  pages: StoredDocument<AdminPageFrontmatter>[];
  posts: StoredDocument<AdminPostFrontmatter>[];
}

const HTML_ONLY_BODY_RULES = [
  {
    message: 'MDX import statements are not supported. Use plain HTML body content.',
    pattern: /^\s*import\s.+$/m
  },
  {
    message: 'MDX export statements are not supported. Use plain HTML body content.',
    pattern: /^\s*export\s.+$/m
  },
  {
    message: 'JSX or MDX component tags are not supported. Use plain HTML body content.',
    pattern: /<[A-Z][\w.-]*(?=[\s/>])/m
  },
  {
    message: 'MDX expression blocks are not supported. Use plain HTML body content.',
    pattern: /(^|\n)\s*\{[\s\S]+?\}\s*(?=\n|$)/m
  }
] as const;

function buildDocumentId(kind: DocumentKind, path: string) {
  return `${kind}:${path}`;
}

function trimRequiredValue(value: string, label: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error(`${label} is required.`);
  }

  return trimmedValue;
}

function normalizeOptionalValue(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function parseTagList(value: string) {
  const tags = value
    .split(/\r?\n|,/g)
    .map((tag) => tag.trim())
    .filter(Boolean);

  return tags.length > 0 ? tags : undefined;
}

export function assertHtmlOnlyDocumentBody(body: string) {
  const normalizedBody = body.trim();

  if (!normalizedBody) {
    throw new Error('Document body content is required.');
  }

  for (const rule of HTML_ONLY_BODY_RULES) {
    if (rule.pattern.test(normalizedBody)) {
      throw new Error(rule.message);
    }
  }
}

export function createPageDraft(document: StoredDocument<AdminPageFrontmatter>): PageDraft {
  return {
    body: document.body,
    date: document.data.date,
    slug: document.data.slug,
    title: document.data.title
  };
}

export function createPostDraft(document: StoredDocument<AdminPostFrontmatter>): PostDraft {
  return {
    body: document.body,
    date: document.data.date,
    image: document.data.image || '',
    slug: document.data.slug,
    tags: (document.data.tags || []).join(', '),
    title: document.data.title
  };
}

export function createDocumentSummaries(content: DocumentContent): DocumentSummary[] {
  return [
    ...content.pages.map((document) => ({
      date: document.data.date,
      id: buildDocumentId('page', document.path),
      kind: 'page' as const,
      path: document.path,
      slug: document.data.slug,
      title: document.data.title
    })),
    ...content.posts.map((document) => ({
      date: document.data.date,
      id: buildDocumentId('post', document.path),
      kind: 'post' as const,
      path: document.path,
      slug: document.data.slug,
      title: document.data.title
    }))
  ].sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
}

export async function loadDocumentContent(repoClient: AdminRepoClient): Promise<DocumentContent> {
  const repository = new ChurchSiteContentRepository(repoClient);
  const [pages, posts] = await Promise.all([repository.listPages(), repository.listPosts()]);

  return {
    loadedAt: new Date().toISOString(),
    pages,
    posts
  };
}

export async function savePageDocument(
  repoClient: AdminRepoClient,
  input: {
    document: StoredDocument<AdminPageFrontmatter>;
    draft: PageDraft;
  }
) {
  const repository = new ChurchSiteContentRepository(repoClient);

  assertHtmlOnlyDocumentBody(input.draft.body);

  await repository.writePage({
    body: input.draft.body,
    data: {
      date: trimRequiredValue(input.draft.date, 'Page publish date'),
      slug: trimRequiredValue(input.draft.slug, 'Page slug'),
      title: trimRequiredValue(input.draft.title, 'Page title')
    },
    message: `Admin: update page ${trimRequiredValue(input.draft.slug, 'Page slug')}`,
    path: input.document.path,
    sha: input.document.sha
  });

  return repository.readPage(input.document.path);
}

export async function savePostDocument(
  repoClient: AdminRepoClient,
  input: {
    document: StoredDocument<AdminPostFrontmatter>;
    draft: PostDraft;
  }
) {
  const repository = new ChurchSiteContentRepository(repoClient);

  assertHtmlOnlyDocumentBody(input.draft.body);

  await repository.writePost({
    body: input.draft.body,
    data: {
      date: trimRequiredValue(input.draft.date, 'News publish date'),
      image: normalizeOptionalValue(input.draft.image),
      slug: input.document.data.slug,
      tags: parseTagList(input.draft.tags),
      title: trimRequiredValue(input.draft.title, 'News title')
    },
    message: `Admin: update news post ${input.document.data.slug}`,
    path: input.document.path,
    sha: input.document.sha
  });

  return repository.readPost(input.document.path);
}

export async function createPageDocument(
  repoClient: AdminRepoClient,
  input: { date: string; slug: string; title: string }
): Promise<{ content: DocumentContent; newId: string }> {
  const repository = new ChurchSiteContentRepository(repoClient);
  const slug = trimRequiredValue(input.slug, 'Page slug');
  const title = trimRequiredValue(input.title, 'Page title');
  const date = trimRequiredValue(input.date, 'Page publish date');

  await repository.writePage({
    body: '<p></p>',
    data: { date, slug, title },
    message: `Admin: create page ${slug}`
  });

  const content = await loadDocumentContent(repoClient);
  return { content, newId: buildDocumentId('page', `${SITE_CONTENT_PATHS.pages}/${slug}.mdx`) };
}

export async function createPostDocument(
  repoClient: AdminRepoClient,
  input: { date: string; slug: string; title: string }
): Promise<{ content: DocumentContent; newId: string }> {
  const repository = new ChurchSiteContentRepository(repoClient);
  const slug = trimRequiredValue(input.slug, 'Post slug');
  const title = trimRequiredValue(input.title, 'Post title');
  const date = trimRequiredValue(input.date, 'Post publish date');

  await repository.writePost({
    body: '<p></p>',
    data: { date, slug, title },
    message: `Admin: create news post ${slug}`
  });

  const content = await loadDocumentContent(repoClient);
  return { content, newId: buildDocumentId('post', `${SITE_CONTENT_PATHS.posts}/${slug}.mdx`) };
}
