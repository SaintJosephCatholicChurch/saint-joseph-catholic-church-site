'use client';

import { deletePreviewMediaBlob, putPreviewMediaBlob } from './previewMediaStore';

import type {
  AdminRepoClient,
  RepoCommitFilesInput,
  RepoCommitFilesResult,
  RepoDeleteInput,
  RepoDirectoryEntry,
  RepoMediaUploadInput,
  RepoTextFile,
  RepoWriteInput,
  RepoWriteResult,
  SessionStoreLike
} from './adminTypes';

type PreviewStoredEntry = {
  content?: string;
  path: string;
  sha: string;
  size?: number;
  type: 'file';
};

type PreviewManifest = {
  mediaFiles: string[];
  textFiles: Record<string, string>;
};

const PREVIEW_REPO_LABEL = 'preview@local';
export const PREVIEW_STORAGE_KEY = 'site-admin-preview-files';
let previewManifestPromise: Promise<PreviewManifest> | null = null;

function computeSha(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return `preview-${hash.toString(16).padStart(8, '0')}-${value.length.toString(16)}`;
}

function fileNameFromPath(path: string) {
  return path.split('/').pop() || path;
}

function getDefaultBrowserSessionStorage(): SessionStoreLike | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage;
}

function normalizePath(path: string) {
  return path.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}

function createFileEntry(path: string, content: string): PreviewStoredEntry {
  return {
    content,
    path,
    sha: computeSha(`${path}:${content}`),
    size: content.length,
    type: 'file'
  };
}

function createMediaEntry(path: string, size?: number): PreviewStoredEntry {
  return {
    path,
    sha: computeSha(`${path}:${size || 0}`),
    size,
    type: 'file'
  };
}

async function loadPreviewManifest() {
  if (previewManifestPromise === null) {
    previewManifestPromise = import('./previewManifest.generated.json').then(
      (module) => module.default as PreviewManifest
    );
  }

  return previewManifestPromise;
}

function createInitialPreviewEntries(manifest: PreviewManifest) {
  const entries = new Map<string, PreviewStoredEntry>();

  for (const [path, content] of Object.entries(manifest.textFiles)) {
    entries.set(path, createFileEntry(path, content));
  }

  for (const path of manifest.mediaFiles) {
    entries.set(path, createMediaEntry(path));
  }

  return entries;
}

async function readStoredEntries(storage: SessionStoreLike | null) {
  const manifest = await loadPreviewManifest();

  if (!storage) {
    return createInitialPreviewEntries(manifest);
  }

  const rawValue = storage.getItem(PREVIEW_STORAGE_KEY);

  if (!rawValue) {
    const initialEntries = createInitialPreviewEntries(manifest);
    storage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(Array.from(initialEntries.values())));
    return initialEntries;
  }

  try {
    const storedEntries = JSON.parse(rawValue) as PreviewStoredEntry[];
    return new Map(storedEntries.map((entry) => [entry.path, entry]));
  } catch {
    storage.removeItem(PREVIEW_STORAGE_KEY);
    return createInitialPreviewEntries(manifest);
  }
}

function buildDirectoryEntries(entries: Map<string, PreviewStoredEntry>, path: string): RepoDirectoryEntry[] {
  const normalizedPath = normalizePath(path);
  const exactEntry = normalizedPath ? entries.get(normalizedPath) : null;

  if (exactEntry) {
    return [
      {
        name: fileNameFromPath(exactEntry.path),
        path: exactEntry.path,
        sha: exactEntry.sha,
        size: exactEntry.size,
        type: 'file'
      }
    ];
  }

  const prefix = normalizedPath ? `${normalizedPath}/` : '';
  const directoryEntries = new Map<string, RepoDirectoryEntry>();

  for (const entry of entries.values()) {
    if (!entry.path.startsWith(prefix)) {
      continue;
    }

    const remainder = entry.path.slice(prefix.length);

    if (!remainder) {
      continue;
    }

    const slashIndex = remainder.indexOf('/');
    const name = slashIndex >= 0 ? remainder.slice(0, slashIndex) : remainder;
    const childPath = prefix ? `${prefix}${name}` : name;

    if (!directoryEntries.has(childPath)) {
      directoryEntries.set(childPath, {
        name,
        path: childPath,
        sha: slashIndex >= 0 ? undefined : entry.sha,
        size: slashIndex >= 0 ? undefined : entry.size,
        type: slashIndex >= 0 ? 'dir' : 'file'
      });
    }
  }

  return Array.from(directoryEntries.values()).sort((left, right) => left.path.localeCompare(right.path));
}

export class PreviewRepoClient implements AdminRepoClient {
  private entriesPromise: Promise<Map<string, PreviewStoredEntry>> | null = null;
  private readonly storage: SessionStoreLike | null;

  constructor(storage: SessionStoreLike | null = getDefaultBrowserSessionStorage()) {
    this.storage = storage;
  }

  private async getEntries() {
    if (this.entriesPromise === null) {
      this.entriesPromise = readStoredEntries(this.storage);
    }

    return this.entriesPromise;
  }

  private persist(entries: Map<string, PreviewStoredEntry>) {
    if (!this.storage) {
      return;
    }

    try {
      this.storage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(Array.from(entries.values())));
    } catch {
      throw new Error('Preview mode could not save local changes because browser storage is full.');
    }
  }

  getRepoLabel() {
    return PREVIEW_REPO_LABEL;
  }

  async listFiles(path: string): Promise<RepoDirectoryEntry[]> {
    const entries = await this.getEntries();
    return buildDirectoryEntries(entries, path);
  }

  async readTextFile(path: string): Promise<RepoTextFile> {
    const normalizedPath = normalizePath(path);
    const entries = await this.getEntries();
    const entry = entries.get(normalizedPath);

    if (!entry?.content) {
      throw new Error(`Preview content for ${normalizedPath} is not available.`);
    }

    return {
      content: entry.content,
      path: entry.path,
      sha: entry.sha
    };
  }

  async writeTextFile(input: RepoWriteInput): Promise<RepoWriteResult> {
    const normalizedPath = normalizePath(input.path);
    const entries = await this.getEntries();

    if (input.sha === undefined && entries.has(normalizedPath)) {
      throw new Error(`${normalizedPath} already exists.`);
    }

    const nextEntry = createFileEntry(normalizedPath, input.content);
    entries.set(normalizedPath, nextEntry);
    this.persist(entries);

    return {
      path: normalizedPath,
      sha: nextEntry.sha
    };
  }

  async commitFiles(input: RepoCommitFilesInput): Promise<RepoCommitFilesResult> {
    const upserts = input.upserts || [];
    const deletes = input.deletes || [];

    if (upserts.length === 0 && deletes.length === 0) {
      throw new Error('A commit must include at least one file change.');
    }

    const entries = await this.getEntries();
    const files: Array<{ path: string; sha: string }> = [];

    for (const upsert of upserts) {
      const normalizedPath = normalizePath(upsert.path);
      const nextEntry = createFileEntry(normalizedPath, upsert.content);
      entries.set(normalizedPath, nextEntry);
      files.push({ path: normalizedPath, sha: nextEntry.sha });
    }

    for (const entry of deletes) {
      const normalizedPath = normalizePath(entry.path);

      if (!entries.delete(normalizedPath)) {
        throw new Error(`Cannot delete ${normalizedPath} because the file does not exist in preview mode.`);
      }

      void deletePreviewMediaBlob(normalizedPath);
    }

    this.persist(entries);

    return {
      commitSha: computeSha(`${input.message}:${files.map((file) => file.path).join('|')}`),
      files
    };
  }

  async deleteFile(input: RepoDeleteInput): Promise<void> {
    const normalizedPath = normalizePath(input.path);
    const entries = await this.getEntries();

    if (!entries.delete(normalizedPath)) {
      throw new Error(`Cannot delete ${normalizedPath} because the file does not exist in preview mode.`);
    }

    this.persist(entries);
    void deletePreviewMediaBlob(normalizedPath);
  }

  async uploadMedia(input: RepoMediaUploadInput): Promise<RepoWriteResult> {
    const normalizedPath = normalizePath(input.path);
    const entries = await this.getEntries();
    const nextEntry = createMediaEntry(normalizedPath, input.file.size);
    entries.set(normalizedPath, nextEntry);
    this.persist(entries);
    await putPreviewMediaBlob(normalizedPath, input.file);

    return {
      path: normalizedPath,
      sha: nextEntry.sha
    };
  }
}
