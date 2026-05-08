import {
  ChurchSiteContentRepository,
  SITE_MEDIA_RULES,
  siteContentAdapters,
  type StoredContentValue
} from './contentRepository';
import { loadSharedContentResource, setSharedContentResource } from './sharedContentStore';

import type { Bulletin } from '../../interface';
import type { AdminRepoClient, RepoDirectoryEntry } from '../services/adminTypes';

export const MEDIA_FOLDERS = [
  {
    description: 'Shared assets for pages, news, and general site content stored in public/files.',
    folderId: 'shared',
    label: 'Shared Files',
    rule: SITE_MEDIA_RULES.shared
  },
  {
    description: 'Staff headshots and portrait images stored in public/staff.',
    folderId: 'staff',
    label: 'Staff Images',
    rule: SITE_MEDIA_RULES.staff
  },
  {
    description: 'Bulletin PDFs and related bulletin assets stored in public/bulletins.',
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
  pdf: string;
}

export interface BulletinSummary {
  date: string;
  id: string;
  name: string;
  path: string;
  pdf: string;
}

export interface BulletinMediaContent {
  bulletins: StoredContentValue<Bulletin>[];
  loadedAt: string;
  mediaAssets: Record<MediaFolderId, MediaAsset[]>;
}

const BULLETIN_MEDIA_CACHE_KEY = 'bulletin-media-content';
const BULLETIN_SESSION_KEY_PREFIX = 'admin-bulletin-content';

const IMAGE_FILE_REGEX = /\.(avif|gif|jpe?g|png|svg|webp)$/i;

function buildBulletinStorageKey(repoClient: AdminRepoClient) {
  return `${BULLETIN_SESSION_KEY_PREFIX}:${repoClient.getRepoLabel()}`;
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

function normalizeOptionalValue(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
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
  return [...bulletins].sort((left, right) => right.value.date.localeCompare(left.value.date));
}

function buildBulletinId(path: string) {
  return `bulletin:${path}`;
}

function buildBulletinCommitMessage(date: string, isNew: boolean) {
  return `Admin: ${isNew ? 'create' : 'update'} bulletin ${date}`;
}

function buildBulletinRenameDeleteMessage(previousPath: string, nextDate: string) {
  return `Admin: remove old bulletin metadata ${fileNameFromPath(previousPath)} after rename to ${nextDate}`;
}

function validateBulletinPdfPath(value: string | undefined) {
  if (!value) {
    return;
  }

  if (!value.startsWith(`${SITE_MEDIA_RULES.bulletins.publicPath}/`)) {
    throw new Error(`Bulletin PDF paths must stay inside ${SITE_MEDIA_RULES.bulletins.publicPath}.`);
  }
}

export function isImageAsset(path: string) {
  return IMAGE_FILE_REGEX.test(path);
}

export function createMediaInsertionMarkup(asset: Pick<MediaAsset, 'kind' | 'name' | 'publicPath'>) {
  if (asset.kind === 'image') {
    return `<img src="${asset.publicPath}" alt="${asset.name}" />`;
  }

  return `<a target="_blank" href="${asset.publicPath}">${asset.name}</a>`;
}

export function createEmptyBulletinDraft() {
  return {
    date: '',
    name: '',
    pdf: ''
  } satisfies BulletinDraft;
}

export function createBulletinDraft(bulletin: StoredContentValue<Bulletin>): BulletinDraft {
  return {
    date: bulletin.value.date || '',
    name: bulletin.value.name || '',
    pdf: bulletin.value.pdf || ''
  };
}

export function createBulletinSummaries(content: BulletinMediaContent): BulletinSummary[] {
  return content.bulletins.map((bulletin) => ({
    date: bulletin.value.date || '',
    id: buildBulletinId(bulletin.path),
    name: bulletin.value.name || 'Untitled bulletin',
    path: bulletin.path,
    pdf: bulletin.value.pdf || ''
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

function setBulletinMediaContent(repoClient: AdminRepoClient, content: BulletinMediaContent) {
  writeStoredBulletins(repoClient, content.bulletins);
  return setSharedContentResource(repoClient, BULLETIN_MEDIA_CACHE_KEY, content);
}

export async function loadBulletinMediaContent(repoClient: AdminRepoClient): Promise<BulletinMediaContent> {
  return loadSharedContentResource(repoClient, BULLETIN_MEDIA_CACHE_KEY, async () => {
    const repository = new ChurchSiteContentRepository(repoClient);
    const [bulletinEntries, sharedAssets, staffAssets, bulletinAssets] = await Promise.all([
      repoClient.listFiles(siteContentAdapters.bulletins.folderPath),
      repoClient.listFiles(SITE_MEDIA_RULES.shared.folderPath),
      repoClient.listFiles(SITE_MEDIA_RULES.staff.folderPath),
      repoClient.listFiles(SITE_MEDIA_RULES.bulletins.folderPath)
    ]);

    const storedBulletins = readStoredBulletins(repoClient);
    const bulletins = sortBulletins(
      await Promise.all(
        toBulletinEntries(bulletinEntries).map((entry) => {
          const storedBulletin = storedBulletins.get(entry.path);

          if (storedBulletin && storedBulletin.sha && entry.sha === storedBulletin.sha) {
            return storedBulletin;
          }

          return repository.readBulletin(entry.path);
        })
      )
    );

    return setBulletinMediaContent(repoClient, {
      bulletins,
      loadedAt: new Date().toISOString(),
      mediaAssets: {
        bulletins: toMediaAssets('bulletins', bulletinAssets),
        shared: toMediaAssets('shared', sharedAssets),
        staff: toMediaAssets('staff', staffAssets)
      }
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
  const date = trimRequiredValue(input.draft.date, 'Bulletin date');
  const name = trimRequiredValue(input.draft.name, 'Bulletin name');
  const pdf = normalizeOptionalValue(input.draft.pdf);

  validateBulletinPdfPath(pdf);

  const currentPath = input.bulletin?.path;
  const nextPath = siteContentAdapters.bulletins.buildPath(date);
  const conflictingBulletin = input.content.bulletins.find(
    (bulletin) => bulletin.path === nextPath && bulletin.path !== currentPath
  );

  if (conflictingBulletin) {
    throw new Error(`A bulletin for ${date} already exists.`);
  }

  const savedResult = await repository.writeBulletin({
    message: buildBulletinCommitMessage(date, !input.bulletin),
    path: nextPath,
    sha: currentPath === nextPath ? input.bulletin?.sha : undefined,
    value: {
      date,
      name,
      pdf
    }
  });

  if (currentPath && currentPath !== nextPath) {
    await repoClient.deleteFile({
      message: buildBulletinRenameDeleteMessage(currentPath, date),
      path: currentPath,
      sha: input.bulletin?.sha
    });
  }

  const savedBulletin = {
    path: savedResult.path,
    sha: savedResult.sha,
    value: {
      date,
      name,
      pdf
    }
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
  const fileName = trimRequiredValue(targetName || '', 'Upload file name');
  const path = input.replaceAsset?.path || buildMediaPath(input.folderId, fileName);

  await repoClient.uploadMedia({
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
    publicPath: buildPublicPath(input.folderId, fileName)
  };
  const cachedContent = await loadBulletinMediaContent(repoClient);
  const nextAssets = [
    ...cachedContent.mediaAssets[input.folderId].filter((asset) => asset.path !== path),
    fallbackAsset
  ].sort((left, right) => left.name.localeCompare(right.name));

  setBulletinMediaContent(repoClient, {
    ...cachedContent,
    loadedAt: new Date().toISOString(),
    mediaAssets: {
      ...cachedContent.mediaAssets,
      [input.folderId]: nextAssets
    }
  });

  return fallbackAsset;
}
