import { mapWithConcurrency } from '../../util/async.util';
import { getBulletinPdfPaths } from '../../components/pages/custom/bulletins/util';
import {
  ChurchSiteContentRepository,
  SITE_MEDIA_RULES,
  siteContentAdapters,
  type StoredContentValue
} from './contentRepository';
import { CONTENT_CONFLICT_RETRY_MESSAGE } from './conflictError';
import { getSharedContentResource, loadSharedContentResource, setSharedContentResource } from './sharedContentStore';

import type { Bulletin } from '../../interface';
import type { AdminRepoClient, RepoDirectoryEntry } from '../services/adminTypes';

export const MEDIA_FOLDERS = [
  {
    description: 'Shared assets for pages, news, and general site content.',
    folderId: 'shared',
    label: 'Shared Files',
    rule: SITE_MEDIA_RULES.shared
  },
  {
    description: 'Staff headshots and portrait images.',
    folderId: 'staff',
    label: 'Staff Images',
    rule: SITE_MEDIA_RULES.staff
  },
  {
    description: 'Bulletin PDFs and related bulletin assets.',
    folderId: 'bulletins',
    label: 'Bulletin Assets',
    rule: SITE_MEDIA_RULES.bulletins
  }
] as const;

export type MediaFolderId = (typeof MEDIA_FOLDERS)[number]['folderId'];

export interface MediaAsset {
  folderId: MediaFolderId;
  id: string;
  kind: 'file' | 'image';
  name: string;
  path: string;
  publicPath: string;
  sha?: string;
  size?: number;
}

export interface BulletinDraft {
  date: string;
  name: string;
  pdfs: string[];
}

export interface BulletinSummary {
  date: string;
  id: string;
  name: string;
  path: string;
  pdfs: string[];
}

export interface MediaLibraryContent {
  loadedAt: string;
  mediaAssets: Record<MediaFolderId, MediaAsset[]>;
}

export interface BulletinMediaContent extends MediaLibraryContent {
  bulletins: StoredContentValue<Bulletin>[];
}

const BULLETIN_MEDIA_CACHE_KEY = 'bulletin-media-content';
const BULLETIN_RECORDS_CACHE_KEY = 'bulletin-records';
const BULLETIN_SESSION_KEY_PREFIX = 'admin-bulletin-content';
const BULLETIN_READ_CONCURRENCY = 8;
const BULLETIN_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_MEDIA_UPLOAD_BYTES = 25 * 1024 * 1024;

const IMAGE_FILE_REGEX = /\.(avif|gif|jpe?g|png|svg|webp)$/i;

function buildBulletinStorageKey(repoClient: AdminRepoClient) {
  return `${BULLETIN_SESSION_KEY_PREFIX}:${repoClient.getRepoLabel()}`;
}

function getMediaAssetsCacheKey(folderId: MediaFolderId) {
  return `media-assets:${folderId}`;
}

function createEmptyMediaAssets(): Record<MediaFolderId, MediaAsset[]> {
  return {
    bulletins: [],
    shared: [],
    staff: []
  };
}

function escapeHtmlAttribute(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeHtmlText(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getFolderConfig(folderId: MediaFolderId) {
  const folder = MEDIA_FOLDERS.find((item) => item.folderId === folderId);

  if (!folder) {
    throw new Error(`Unknown media folder: ${folderId}`);
  }

  return folder;
}

function fileNameFromPath(path: string) {
  return path.split('/').pop() || path;
}

function trimRequiredValue(value: string, label: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error(`${label} is required.`);
  }

  return trimmedValue;
}

function normalizeBulletinDate(value: string) {
  const date = trimRequiredValue(value, 'Bulletin date');

  if (!BULLETIN_DATE_PATTERN.test(date) || date.includes('..') || date.includes('/') || date.includes('\\')) {
    throw new Error('Bulletin date must be YYYY-MM-DD.');
  }

  return date;
}

function sanitizeUploadedFileName(fileName: string) {
  const normalizedValue = fileName
    .trim()
    .replace(/\\/g, '/')
    .split('/')
    .pop()
    ?.replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!normalizedValue) {
    throw new Error('A valid file name is required for uploads.');
  }

  return normalizedValue;
}

function buildMediaPath(folderId: MediaFolderId, fileName: string) {
  const folder = getFolderConfig(folderId);
  return `${folder.rule.folderPath}/${sanitizeUploadedFileName(fileName)}`;
}

function buildPublicPath(folderId: MediaFolderId, fileName: string) {
  const folder = getFolderConfig(folderId);
  return `${folder.rule.publicPath}/${fileName}`;
}

function toMediaAsset(folderId: MediaFolderId, entry: RepoDirectoryEntry): MediaAsset {
  const name = fileNameFromPath(entry.path);

  return {
    folderId,
    id: `${folderId}:${entry.path}`,
    kind: IMAGE_FILE_REGEX.test(name) ? 'image' : 'file',
    name,
    path: entry.path,
    publicPath: buildPublicPath(folderId, name),
    sha: entry.sha,
    size: entry.size
  };
}

function toMediaAssets(folderId: MediaFolderId, entries: RepoDirectoryEntry[]) {
  return entries
    .filter((entry) => entry.type === 'file')
    .map((entry) => toMediaAsset(folderId, entry))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function toBulletinEntries(entries: RepoDirectoryEntry[]) {
  return entries
    .filter((entry) => entry.type === 'file' && entry.path.endsWith('.json'))
    .sort((left, right) => left.path.localeCompare(right.path));
}

function sortBulletins(bulletins: StoredContentValue<Bulletin>[]) {
  return [...bulletins].sort((left, right) => (right.value.date || '').localeCompare(left.value.date || ''));
}

function buildBulletinId(path: string) {
  return `bulletin:${path}`;
}

function buildBulletinCommitMessage(date: string, isNew: boolean) {
  return `Admin: ${isNew ? 'create' : 'update'} bulletin ${date}`;
}

function validateBulletinPdfPath(value: string | undefined) {
  if (!value) {
    return;
  }

  const prefix = `${SITE_MEDIA_RULES.bulletins.publicPath}/`;

  if (!value.startsWith(prefix)) {
    throw new Error(`Bulletin PDF paths must stay inside ${SITE_MEDIA_RULES.bulletins.publicPath}.`);
  }

  const relativePath = value.slice(prefix.length).replace(/\\/g, '/');
  const segments = relativePath.split('/').filter(Boolean);

  if (segments.length === 0 || segments.some((segment) => segment === '.' || segment === '..')) {
    throw new Error(`Bulletin PDF paths must stay inside ${SITE_MEDIA_RULES.bulletins.publicPath}.`);
  }
}

function normalizeBulletinDraftPdfs(pdfs: string[]) {
  const normalizedPdfs: string[] = [];

  for (const pdf of pdfs) {
    const trimmedPdf = pdf.trim();
    if (!trimmedPdf) {
      continue;
    }

    validateBulletinPdfPath(trimmedPdf);

    if (normalizedPdfs.includes(trimmedPdf)) {
      throw new Error('Each bulletin PDF can only be attached once.');
    }

    normalizedPdfs.push(trimmedPdf);
  }

  return normalizedPdfs;
}

function serializeBulletinPdfFields(pdfs: string[]): Pick<Bulletin, 'pdf' | 'pdfs'> {
  if (pdfs.length === 0) {
    return {};
  }

  if (pdfs.length === 1) {
    return { pdf: pdfs[0] };
  }

  return {
    pdf: pdfs[0],
    pdfs
  };
}

export function getBulletinPdfListLabel(pdfs: string[]) {
  if (pdfs.length === 0) {
    return 'No linked PDF';
  }

  if (pdfs.length === 1) {
    return fileNameFromPath(pdfs[0]);
  }

  return `${pdfs.length} PDFs`;
}

export function isImageAsset(path: string) {
  return IMAGE_FILE_REGEX.test(path);
}

export function createMediaInsertionMarkup(asset: Pick<MediaAsset, 'kind' | 'name' | 'publicPath'>) {
  if (asset.kind === 'image') {
    return `<img src="${escapeHtmlAttribute(asset.publicPath)}" alt="${escapeHtmlAttribute(asset.name)}" />`;
  }

  return `<a target="_blank" href="${escapeHtmlAttribute(asset.publicPath)}">${escapeHtmlText(asset.name)}</a>`;
}

export function createEmptyBulletinDraft(): BulletinDraft {
  return {
    date: '',
    name: '',
    pdfs: []
  };
}

export function createBulletinDraft(bulletin: StoredContentValue<Bulletin>): BulletinDraft {
  return {
    date: bulletin.value.date || '',
    name: bulletin.value.name || '',
    pdfs: getBulletinPdfPaths(bulletin.value)
  };
}

export function createBulletinSummaries(content: BulletinMediaContent): BulletinSummary[] {
  return content.bulletins.map((bulletin) => ({
    date: bulletin.value.date || '',
    id: buildBulletinId(bulletin.path),
    name: bulletin.value.name || 'Untitled bulletin',
    path: bulletin.path,
    pdfs: getBulletinPdfPaths(bulletin.value)
  }));
}

function readStoredBulletins(repoClient: AdminRepoClient) {
  if (typeof window === 'undefined') {
    return new Map<string, StoredContentValue<Bulletin>>();
  }

  try {
    const rawValue = window.sessionStorage.getItem(buildBulletinStorageKey(repoClient));
    if (!rawValue) {
      return new Map<string, StoredContentValue<Bulletin>>();
    }

    const storedBulletins = JSON.parse(rawValue) as StoredContentValue<Bulletin>[];
    return new Map(storedBulletins.map((bulletin) => [bulletin.path, bulletin]));
  } catch {
    window.sessionStorage.removeItem(buildBulletinStorageKey(repoClient));
    return new Map<string, StoredContentValue<Bulletin>>();
  }
}

function writeStoredBulletins(repoClient: AdminRepoClient, bulletins: StoredContentValue<Bulletin>[]) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(buildBulletinStorageKey(repoClient), JSON.stringify(bulletins));
  } catch {
    window.sessionStorage.removeItem(buildBulletinStorageKey(repoClient));
  }
}

function updateMediaFolderCache(repoClient: AdminRepoClient, folderId: MediaFolderId, assets: MediaAsset[]) {
  setSharedContentResource(repoClient, getMediaAssetsCacheKey(folderId), assets);
  const cachedContent = getSharedContentResource<BulletinMediaContent>(repoClient, BULLETIN_MEDIA_CACHE_KEY);

  if (!cachedContent) {
    return;
  }

  setBulletinMediaContent(repoClient, {
    ...cachedContent,
    loadedAt: new Date().toISOString(),
    mediaAssets: {
      ...cachedContent.mediaAssets,
      [folderId]: assets
    }
  });
}

function setBulletinMediaContent(repoClient: AdminRepoClient, content: BulletinMediaContent) {
  writeStoredBulletins(repoClient, content.bulletins);
  setSharedContentResource(repoClient, BULLETIN_RECORDS_CACHE_KEY, content.bulletins);
  (Object.keys(content.mediaAssets) as MediaFolderId[]).forEach((folderId) => {
    setSharedContentResource(repoClient, getMediaAssetsCacheKey(folderId), content.mediaAssets[folderId]);
  });
  return setSharedContentResource(repoClient, BULLETIN_MEDIA_CACHE_KEY, content);
}

export async function loadMediaAssets(
  repoClient: AdminRepoClient,
  folderIds: MediaFolderId[]
): Promise<Record<MediaFolderId, MediaAsset[]>> {
  const uniqueFolderIds = [...new Set(folderIds)];
  const loadedFolders = await Promise.all(
    uniqueFolderIds.map((folderId) =>
      loadSharedContentResource(repoClient, getMediaAssetsCacheKey(folderId), async () => {
        const entries = await repoClient.listFiles(getFolderConfig(folderId).rule.folderPath);
        return toMediaAssets(folderId, entries);
      })
    )
  );
  const mediaAssets = createEmptyMediaAssets();

  uniqueFolderIds.forEach((folderId, index) => {
    mediaAssets[folderId] = loadedFolders[index];
  });

  return mediaAssets;
}

export async function loadBulletinRecords(repoClient: AdminRepoClient): Promise<StoredContentValue<Bulletin>[]> {
  return loadSharedContentResource(repoClient, BULLETIN_RECORDS_CACHE_KEY, async () => {
    const repository = new ChurchSiteContentRepository(repoClient);
    const bulletinEntries = toBulletinEntries(await repoClient.listFiles(siteContentAdapters.bulletins.folderPath));
    const storedBulletins = readStoredBulletins(repoClient);

    return sortBulletins(
      await mapWithConcurrency(bulletinEntries, BULLETIN_READ_CONCURRENCY, async (entry) => {
        const storedBulletin = storedBulletins.get(entry.path);

        if (storedBulletin && storedBulletin.sha && entry.sha === storedBulletin.sha) {
          return storedBulletin;
        }

        return repository.readBulletin(entry.path);
      })
    );
  });
}

export async function loadMediaLibraryContent(
  repoClient: AdminRepoClient,
  folderIds: MediaFolderId[]
): Promise<MediaLibraryContent> {
  const mediaAssets = await loadMediaAssets(repoClient, folderIds);
  return {
    loadedAt: new Date().toISOString(),
    mediaAssets
  };
}

export async function loadBulletinMediaContent(repoClient: AdminRepoClient): Promise<BulletinMediaContent> {
  return loadSharedContentResource(repoClient, BULLETIN_MEDIA_CACHE_KEY, async () => {
    const [bulletins, mediaAssets] = await Promise.all([
      loadBulletinRecords(repoClient),
      loadMediaAssets(repoClient, ['bulletins'])
    ]);

    return setBulletinMediaContent(repoClient, {
      bulletins,
      loadedAt: new Date().toISOString(),
      mediaAssets
    });
  });
}

export async function saveBulletin(
  repoClient: AdminRepoClient,
  input: {
    bulletin?: StoredContentValue<Bulletin> | null;
    content: BulletinMediaContent;
    draft: BulletinDraft;
  }
) {
  const repository = new ChurchSiteContentRepository(repoClient);
  const date = normalizeBulletinDate(input.draft.date);
  const name = trimRequiredValue(input.draft.name, 'Bulletin name');
  const pdfs = normalizeBulletinDraftPdfs(input.draft.pdfs);
  const pdfFields = serializeBulletinPdfFields(pdfs);

  const currentPath = input.bulletin?.path;
  const nextPath = siteContentAdapters.bulletins.buildPath(date);
  const conflictingBulletin = input.content.bulletins.find(
    (bulletin) => bulletin.path === nextPath && bulletin.path !== currentPath
  );

  if (conflictingBulletin) {
    throw new Error(`A bulletin for ${date} already exists.`);
  }

  const value = {
    date,
    name,
    ...pdfFields
  };
  const serializedValue = siteContentAdapters.bulletins.serialize(value);
  const isRename = Boolean(currentPath && currentPath !== nextPath);
  let savedPath = nextPath;
  let savedSha = input.bulletin?.sha || '';

  if (isRename && currentPath) {
    if (input.bulletin?.sha) {
      const currentFile = await repoClient.readTextFile(currentPath);

      if (currentFile.sha && currentFile.sha !== input.bulletin.sha) {
        throw new Error(CONTENT_CONFLICT_RETRY_MESSAGE);
      }
    }

    const commitResult = await repoClient.commitFiles({
      deletes: [{ path: currentPath }],
      message: buildBulletinCommitMessage(date, false),
      upserts: [{ content: serializedValue, path: nextPath }]
    });
    const committedFile = commitResult.files.find((file) => file.path === nextPath);

    if (!committedFile?.sha) {
      throw new Error(`GitHub did not return a SHA for ${nextPath}. Reload the admin page and try again.`);
    }

    savedPath = committedFile.path;
    savedSha = committedFile.sha;
  } else {
    const savedResult = await repository.writeBulletin({
      message: buildBulletinCommitMessage(date, !input.bulletin),
      path: nextPath,
      sha: currentPath === nextPath ? input.bulletin?.sha : undefined,
      value
    });
    savedPath = savedResult.path || nextPath;
    savedSha = savedResult.sha;
  }

  const savedBulletin = {
    path: savedPath,
    sha: savedSha,
    value
  };
  const remainingBulletins = input.content.bulletins.filter(
    (bulletin) => bulletin.path !== currentPath && bulletin.path !== nextPath
  );

  setBulletinMediaContent(repoClient, {
    ...input.content,
    bulletins: sortBulletins([...remainingBulletins, savedBulletin]),
    loadedAt: new Date().toISOString()
  });

  return savedBulletin;
}

export async function uploadMediaAsset(
  repoClient: AdminRepoClient,
  input: {
    file: Blob;
    fileName?: string;
    folderId: MediaFolderId;
    replaceAsset?: MediaAsset | null;
  }
) {
  const targetName = input.replaceAsset?.name || input.fileName;
  const fileName = sanitizeUploadedFileName(trimRequiredValue(targetName || '', 'Upload file name'));
  const path = input.replaceAsset?.path || buildMediaPath(input.folderId, fileName);

  if (input.file.size > MAX_MEDIA_UPLOAD_BYTES) {
    throw new Error('Files must be 25 MB or smaller.');
  }

  const currentAssets = (await loadMediaAssets(repoClient, [input.folderId]))[input.folderId];

  if (!input.replaceAsset && currentAssets.some((asset) => asset.path === path)) {
    throw new Error(`A file named ${fileName} already exists. Choose a different name or replace the existing file.`);
  }

  const uploaded = await repoClient.uploadMedia({
    file: input.file,
    message: `Admin: ${input.replaceAsset ? 'replace' : 'upload'} ${getFolderConfig(input.folderId).label.toLowerCase()} ${fileName}`,
    path,
    sha: input.replaceAsset?.sha
  });

  const fallbackAsset: MediaAsset = {
    folderId: input.folderId,
    id: `${input.folderId}:${path}`,
    kind: IMAGE_FILE_REGEX.test(fileName) ? 'image' : 'file',
    name: fileName,
    path,
    publicPath: buildPublicPath(input.folderId, fileName),
    sha: uploaded.sha
  };
  const nextAssets = [...currentAssets.filter((asset) => asset.path !== path), fallbackAsset].sort((left, right) =>
    left.name.localeCompare(right.name)
  );

  updateMediaFolderCache(repoClient, input.folderId, nextAssets);

  return fallbackAsset;
}

export async function deleteMediaAsset(repoClient: AdminRepoClient, asset: MediaAsset) {
  const sha = asset.sha;

  if (!sha) {
    throw new Error(`Cannot delete ${asset.name} because a file SHA is required.`);
  }

  await repoClient.deleteFile({
    message: `Admin: delete ${getFolderConfig(asset.folderId).label.toLowerCase()} ${asset.name}`,
    path: asset.path,
    sha
  });

  const currentAssets = (await loadMediaAssets(repoClient, [asset.folderId]))[asset.folderId];
  const nextAssets = currentAssets.filter((entry) => entry.path !== asset.path);
  updateMediaFolderCache(repoClient, asset.folderId, nextAssets);

  return nextAssets;
}

export async function deleteBulletin(
  repoClient: AdminRepoClient,
  input: {
    bulletin: StoredContentValue<Bulletin>;
    content: BulletinMediaContent;
  }
) {
  await repoClient.deleteFile({
    message: `Admin: delete bulletin ${input.bulletin.value.date || fileNameFromPath(input.bulletin.path)}`,
    path: input.bulletin.path,
    sha: input.bulletin.sha
  });

  const nextContent: BulletinMediaContent = {
    ...input.content,
    bulletins: input.content.bulletins.filter((bulletin) => bulletin.path !== input.bulletin.path),
    loadedAt: new Date().toISOString()
  };

  setBulletinMediaContent(repoClient, nextContent);
  return nextContent;
}
