import {
  ChurchSiteContentRepository,
  SITE_CONTENT_PATHS,
  type AdminPageFrontmatter,
  type AdminPostFrontmatter,
  type StoredDocument
} from './contentRepository';
import { getSharedContentResource, loadSharedContentResource, setSharedContentResource } from './sharedContentStore';

import type { PostContent } from '../../interface';
import type { AdminRepoClient, RepoDirectoryEntry } from '../services/adminTypes';

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
  excerpt?: string;
  id: string;
  image?: string;
  kind: DocumentKind;
  path: string;
  sha?: string;
  slug: string;
  tags?: string[];
  title: string;
}

export interface DocumentContent {
  loadedAt: string;
  pages: StoredDocument<AdminPageFrontmatter>[];
  posts: StoredDocument<AdminPostFrontmatter>[];
}

const DOCUMENT_CONTENT_CACHE_KEY = 'document-content';
const DOCUMENT_SUMMARIES_CACHE_KEY = 'document-summaries';
const DOCUMENT_SUMMARIES_SESSION_KEY_PREFIX = 'admin-document-summaries';
const DOCUMENT_FILE_EXTENSION = '.mdx';

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

function buildDocumentSummaryStorageKey(repoClient: AdminRepoClient) {
  return `${DOCUMENT_SUMMARIES_SESSION_KEY_PREFIX}:${repoClient.getRepoLabel()}`;
}

function buildPostExcerpt(body: string) {
  const summaryRegex = /^<p>([\w\W]+?)<\/p>/i;
  let summaryMatch = summaryRegex.exec(body);

  const htmlSummaryRegex =
    /^([\s\n]*(?:<(?:p|ul|ol|h1|h2|h3|h4|h5|h6|div)>(?:[\s\S])*?<\/(?:p|ul|ol|h1|h2|h3|h4|h5|h6|div)>[\s\n]*){1,2})/i;
  if (!summaryMatch || summaryMatch.length < 2) {
    summaryMatch = htmlSummaryRegex.exec(body);
  }

  return summaryMatch && summaryMatch.length >= 2 ? summaryMatch[1].replace(/<img([\w\W]+?)\/>/g, '') : body;
}

function compareDateDescending(left: string, right: string) {
  return new Date(right).getTime() - new Date(left).getTime();
}

function filterDocumentEntries(entries: RepoDirectoryEntry[]) {
  return entries.filter((entry) => entry.type === 'file' && entry.path.endsWith(DOCUMENT_FILE_EXTENSION));
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

function readStoredDocumentSummaries(repoClient: AdminRepoClient) {
  if (typeof window === 'undefined') {
    return {} as Record<string, DocumentSummary>;
  }

  try {
    const rawValue = window.sessionStorage.getItem(buildDocumentSummaryStorageKey(repoClient));
    if (!rawValue) {
      return {} as Record<string, DocumentSummary>;
    }

    return JSON.parse(rawValue) as Record<string, DocumentSummary>;
  } catch {
    window.sessionStorage.removeItem(buildDocumentSummaryStorageKey(repoClient));
    return {} as Record<string, DocumentSummary>;
  }
}

function setDocumentCaches(repoClient: AdminRepoClient, content: DocumentContent, summaries: DocumentSummary[]) {
  setSharedContentResource(repoClient, DOCUMENT_CONTENT_CACHE_KEY, content);
  setSharedContentResource(repoClient, DOCUMENT_SUMMARIES_CACHE_KEY, summaries);

  if (typeof window !== 'undefined') {
    const serializedSummaries = Object.fromEntries(summaries.map((summary) => [summary.id, summary]));
    window.sessionStorage.setItem(buildDocumentSummaryStorageKey(repoClient), JSON.stringify(serializedSummaries));
  }

  return content;
}

function sortDocumentCollection<T extends AdminPageFrontmatter | AdminPostFrontmatter>(documents: StoredDocument<T>[]) {
  return [...documents].sort((left, right) => compareDateDescending(left.data.date, right.data.date));
}

function trimRequiredValue(value: string, label: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error(`${label} is required.`);
  }

  return trimmedValue;
}

function upsertDocumentInContent(
  content: DocumentContent,
  kind: DocumentKind,
  document: StoredDocument<AdminPageFrontmatter> | StoredDocument<AdminPostFrontmatter>,
  previousPath?: string
): DocumentContent {
  if (kind === 'page') {
    return {
      ...content,
      loadedAt: new Date().toISOString(),
      pages: sortDocumentCollection([
        ...content.pages.filter((item) => item.path !== previousPath && item.path !== document.path),
        document as StoredDocument<AdminPageFrontmatter>
      ])
    };
  }

  return {
    ...content,
    loadedAt: new Date().toISOString(),
    posts: sortDocumentCollection([
      ...content.posts.filter((item) => item.path !== previousPath && item.path !== document.path),
      document as StoredDocument<AdminPostFrontmatter>
    ])
  };
}

function buildPageSummary(document: StoredDocument<AdminPageFrontmatter>): DocumentSummary {
  return {
    date: document.data.date,
    id: buildDocumentId('page', document.path),
    kind: 'page',
    path: document.path,
    sha: document.sha,
    slug: document.data.slug,
    title: document.data.title
  };
}

function buildPostSummary(document: StoredDocument<AdminPostFrontmatter>): DocumentSummary {
  return {
    date: document.data.date,
    excerpt: buildPostExcerpt(document.body),
    id: buildDocumentId('post', document.path),
    image: document.data.image,
    kind: 'post',
    path: document.path,
    sha: document.sha,
    slug: document.data.slug,
    tags: document.data.tags,
    title: document.data.title
  };
}

function createPagePlaceholder(summary: DocumentSummary): StoredDocument<AdminPageFrontmatter> {
  return {
    body: '',
    data: {
      date: summary.date,
      slug: summary.slug,
      title: summary.title
    },
    path: summary.path,
    sha: summary.sha
  };
}

function createPostPlaceholder(summary: DocumentSummary): StoredDocument<AdminPostFrontmatter> {
  return {
    body: '',
    data: {
      date: summary.date,
      image: summary.image,
      slug: summary.slug,
      tags: summary.tags,
      title: summary.title
    },
    path: summary.path,
    sha: summary.sha
  };
}

async function loadDocumentCollection(
  repoClient: AdminRepoClient,
  repository: ChurchSiteContentRepository,
  kind: DocumentKind,
  cachedSummaries: Record<string, DocumentSummary>
) {
  const folderPath = kind === 'page' ? SITE_CONTENT_PATHS.pages : SITE_CONTENT_PATHS.posts;
  const entries = filterDocumentEntries(await repoClient.listFiles(folderPath));
  const results = await Promise.all(
    entries.map(async (entry) => {
      const cachedSummary = cachedSummaries[buildDocumentId(kind, entry.path)];

      if (cachedSummary && cachedSummary.sha === entry.sha) {
        return {
          document:
            kind === 'page'
              ? createPagePlaceholder({ ...cachedSummary, sha: entry.sha })
              : createPostPlaceholder({ ...cachedSummary, sha: entry.sha }),
          summary: { ...cachedSummary, sha: entry.sha }
        };
      }

      const document = kind === 'page' ? await repository.readPage(entry.path) : await repository.readPost(entry.path);

      return {
        document,
        summary: kind === 'page' ? buildPageSummary(document) : buildPostSummary(document)
      };
    })
  );

  return {
    documents: sortDocumentCollection(
      results.map(
        (result) => result.document as StoredDocument<AdminPageFrontmatter> | StoredDocument<AdminPostFrontmatter>
      )
    ),
    summaries: results.map((result) => result.summary)
  };
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
  const cachedSummaries = content.pages.map(buildPageSummary).concat(content.posts.map(buildPostSummary));
  return cachedSummaries.sort((left, right) => compareDateDescending(left.date, right.date));
}

export async function loadDocumentContent(repoClient: AdminRepoClient): Promise<DocumentContent> {
  return loadSharedContentResource(repoClient, DOCUMENT_CONTENT_CACHE_KEY, async () => {
    const repository = new ChurchSiteContentRepository(repoClient);
    const cachedSummaries = readStoredDocumentSummaries(repoClient);
    const [pagesResult, postsResult] = await Promise.all([
      loadDocumentCollection(repoClient, repository, 'page', cachedSummaries),
      loadDocumentCollection(repoClient, repository, 'post', cachedSummaries)
    ]);

    const content: DocumentContent = {
      loadedAt: new Date().toISOString(),
      pages: pagesResult.documents,
      posts: postsResult.documents
    };

    return setDocumentCaches(repoClient, content, [...pagesResult.summaries, ...postsResult.summaries]);
  });
}

export async function ensureDocumentLoaded(
  repoClient: AdminRepoClient,
  content: DocumentContent,
  documentId: string
): Promise<DocumentContent> {
  const summary =
    getSharedContentResource<DocumentSummary[]>(repoClient, DOCUMENT_SUMMARIES_CACHE_KEY)?.find(
      (item) => item.id === documentId
    ) || createDocumentSummaries(content).find((item) => item.id === documentId);

  if (!summary) {
    return content;
  }

  if (summary.kind === 'page') {
    const currentDocument = content.pages.find((document) => buildDocumentId('page', document.path) === documentId);
    if (currentDocument?.body) {
      return content;
    }

    const repository = new ChurchSiteContentRepository(repoClient);
    const document = await repository.readPage(summary.path);
    const nextContent = upsertDocumentInContent(content, 'page', document, summary.path);
    return setDocumentCaches(repoClient, nextContent, createDocumentSummaries(nextContent));
  }

  const currentDocument = content.posts.find((document) => buildDocumentId('post', document.path) === documentId);
  if (currentDocument?.body) {
    return content;
  }

  const repository = new ChurchSiteContentRepository(repoClient);
  const document = await repository.readPost(summary.path);
  const nextContent = upsertDocumentInContent(content, 'post', document, summary.path);
  return setDocumentCaches(repoClient, nextContent, createDocumentSummaries(nextContent));
}

export async function savePageDocument(
  repoClient: AdminRepoClient,
  input: {
    content: DocumentContent;
    document: StoredDocument<AdminPageFrontmatter>;
    draft: PageDraft;
  }
) {
  const repository = new ChurchSiteContentRepository(repoClient);

  assertHtmlOnlyDocumentBody(input.draft.body);

  const date = trimRequiredValue(input.draft.date, 'Page publish date');
  const slug = trimRequiredValue(input.draft.slug, 'Page slug');
  const title = trimRequiredValue(input.draft.title, 'Page title');
  const result = await repository.writePage({
    body: input.draft.body,
    data: { date, slug, title },
    message: `Admin: update page ${slug}`,
    path: input.document.path,
    sha: input.document.sha
  });

  const savedDocument: StoredDocument<AdminPageFrontmatter> = {
    body: input.draft.body,
    data: { date, slug, title },
    path: result.path || input.document.path,
    sha: result.sha || input.document.sha
  };
  const nextContent = upsertDocumentInContent(input.content, 'page', savedDocument, input.document.path);

  return setDocumentCaches(repoClient, nextContent, createDocumentSummaries(nextContent));
}

export async function savePostDocument(
  repoClient: AdminRepoClient,
  input: {
    content: DocumentContent;
    document: StoredDocument<AdminPostFrontmatter>;
    draft: PostDraft;
  }
) {
  const repository = new ChurchSiteContentRepository(repoClient);

  assertHtmlOnlyDocumentBody(input.draft.body);

  const date = trimRequiredValue(input.draft.date, 'News publish date');
  const title = trimRequiredValue(input.draft.title, 'News title');
  const image = normalizeOptionalValue(input.draft.image);
  const tags = parseTagList(input.draft.tags);
  const result = await repository.writePost({
    body: input.draft.body,
    data: {
      date,
      image,
      slug: input.document.data.slug,
      tags,
      title
    },
    message: `Admin: update news post ${input.document.data.slug}`,
    path: input.document.path,
    sha: input.document.sha
  });

  const savedDocument: StoredDocument<AdminPostFrontmatter> = {
    body: input.draft.body,
    data: {
      date,
      image,
      slug: input.document.data.slug,
      tags,
      title
    },
    path: result.path || input.document.path,
    sha: result.sha || input.document.sha
  };
  const nextContent = upsertDocumentInContent(input.content, 'post', savedDocument, input.document.path);

  return setDocumentCaches(repoClient, nextContent, createDocumentSummaries(nextContent));
}

export async function createPageDocument(
  repoClient: AdminRepoClient,
  input: { content?: DocumentContent | null; date: string; slug: string; title: string }
): Promise<{ content: DocumentContent; newId: string }> {
  const repository = new ChurchSiteContentRepository(repoClient);
  const slug = trimRequiredValue(input.slug, 'Page slug');
  const title = trimRequiredValue(input.title, 'Page title');
  const date = trimRequiredValue(input.date, 'Page publish date');

  const result = await repository.writePage({
    body: '<p></p>',
    data: { date, slug, title },
    message: `Admin: create page ${slug}`
  });

  const document: StoredDocument<AdminPageFrontmatter> = {
    body: '<p></p>',
    data: { date, slug, title },
    path: result.path || `${SITE_CONTENT_PATHS.pages}/${slug}.mdx`,
    sha: result.sha
  };
  const baseContent = input.content ||
    getSharedContentResource<DocumentContent>(repoClient, DOCUMENT_CONTENT_CACHE_KEY) || {
      loadedAt: new Date().toISOString(),
      pages: [],
      posts: []
    };
  const nextContent = upsertDocumentInContent(baseContent, 'page', document);
  const content = setDocumentCaches(repoClient, nextContent, createDocumentSummaries(nextContent));
  return { content, newId: buildDocumentId('page', document.path) };
}

export async function createPostDocument(
  repoClient: AdminRepoClient,
  input: { content?: DocumentContent | null; date: string; slug: string; title: string }
): Promise<{ content: DocumentContent; newId: string }> {
  const repository = new ChurchSiteContentRepository(repoClient);
  const slug = trimRequiredValue(input.slug, 'Post slug');
  const title = trimRequiredValue(input.title, 'Post title');
  const date = trimRequiredValue(input.date, 'Post publish date');

  const result = await repository.writePost({
    body: '<p></p>',
    data: { date, slug, title },
    message: `Admin: create news post ${slug}`
  });

  const document: StoredDocument<AdminPostFrontmatter> = {
    body: '<p></p>',
    data: { date, slug, title },
    path: result.path || `${SITE_CONTENT_PATHS.posts}/${slug}.mdx`,
    sha: result.sha
  };
  const baseContent = input.content ||
    getSharedContentResource<DocumentContent>(repoClient, DOCUMENT_CONTENT_CACHE_KEY) || {
      loadedAt: new Date().toISOString(),
      pages: [],
      posts: []
    };
  const nextContent = upsertDocumentInContent(baseContent, 'post', document);
  const content = setDocumentCaches(repoClient, nextContent, createDocumentSummaries(nextContent));
  return { content, newId: buildDocumentId('post', document.path) };
}

export async function loadRecentPostContent(repoClient: AdminRepoClient, limit: number): Promise<PostContent[]> {
  await loadDocumentContent(repoClient);
  return getLoadedRecentPostContent(repoClient, limit);
}

export function getLoadedRecentPostContent(repoClient: AdminRepoClient, limit: number): PostContent[] {
  const summaries = getSharedContentResource<DocumentSummary[]>(repoClient, DOCUMENT_SUMMARIES_CACHE_KEY) || [];

  return summaries
    .filter((summary) => summary.kind === 'post')
    .sort((left, right) => compareDateDescending(left.date, right.date))
    .slice(0, limit)
    .map((summary) => ({
      content: '',
      data: {
        date: summary.date,
        image: summary.image || '',
        slug: summary.slug,
        tags: summary.tags || [],
        title: summary.title
      },
      fullPath: summary.path,
      summary: summary.excerpt || ''
    }));
}
