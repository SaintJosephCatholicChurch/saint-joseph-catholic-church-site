import type {
  AdminRepoClient,
  AdminUser,
  RepoDeleteInput,
  RepoDirectoryEntry,
  RepoMediaUploadInput,
  RepoTextFile,
  SessionStoreLike,
  RepoWriteInput,
  RepoWriteResult
} from './adminTypes';

type CachedGetResponse = {
  etag?: string;
  value: unknown;
};

type GitHubUserResponse = {
  avatar_url?: string;
  html_url?: string;
  login: string;
  name?: string;
};

type GitHubRepositoryResponse = {
  permissions?: {
    push?: boolean;
  };
};

type GitHubContentsFileResponse = {
  content?: string;
  name: string;
  path: string;
  sha: string;
  size?: number;
  type: 'file';
};

type GitHubContentsDirectoryItem = {
  name: string;
  path: string;
  sha: string;
  size?: number;
  type: 'dir' | 'file';
};

type GitHubWriteResponse = {
  commit?: {
    sha: string;
  };
  content?: {
    path: string;
    sha: string;
  };
};

type GitHubRepoClientConfig = {
  apiRoot: string;
  authScheme?: string;
  branch: string;
  cacheStore?: SessionStoreLike | null;
  repo: string;
  token: string;
};

function buildPersistedCacheStorageKey(repo: string, branch: string) {
  return `admin-github-response-cache:${repo}@${branch}`;
}

function isCachedGetResponse(value: unknown): value is CachedGetResponse {
  return Boolean(value) && typeof value === 'object' && 'value' in value;
}

function encodePath(path: string) {
  return path
    .replace(/^\/+/, '')
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function encodeBytesToBase64(bytes: Uint8Array) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }

  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.slice(offset, offset + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function decodeBase64ToText(value: string) {
  const normalizedValue = value.replace(/\n/g, '');

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(normalizedValue, 'base64').toString('utf8');
  }

  const binary = atob(normalizedValue);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function createErrorMessage(status: number, payload: unknown) {
  if (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string') {
    return payload.message;
  }

  return `GitHub request failed with status ${status}.`;
}

export class GitHubRepoClient implements AdminRepoClient {
  private apiRoot: string;
  private authScheme: string;
  private branch: string;
  private cacheStore: SessionStoreLike | null;
  private inFlightRequests = new Map<string, Promise<unknown>>();
  private repo: string;
  private responseCache = new Map<string, CachedGetResponse>();
  private responseCacheStorageKey: string;
  private stalePersistedCacheKeys = new Set<string>();
  private token: string;

  constructor(config: GitHubRepoClientConfig) {
    this.apiRoot = config.apiRoot.replace(/\/+$/g, '');
    this.authScheme = config.authScheme || 'Bearer';
    this.branch = config.branch;
    this.cacheStore = config.cacheStore || null;
    this.repo = config.repo;
    this.responseCacheStorageKey = buildPersistedCacheStorageKey(config.repo, config.branch);
    this.token = config.token;
    this.restorePersistedResponseCache();
  }

  getRepoLabel() {
    return `${this.repo}@${this.branch}`;
  }

  async listFiles(path: string): Promise<RepoDirectoryEntry[]> {
    const encodedPath = encodePath(path);
    const endpoint = encodedPath ? `/repos/${this.repo}/contents/${encodedPath}` : `/repos/${this.repo}/contents`;
    const response = await this.requestJson<GitHubContentsDirectoryItem[] | GitHubContentsFileResponse>(endpoint, {
      query: { ref: this.branch }
    });

    if (!Array.isArray(response)) {
      return [
        {
          name: response.name,
          path: response.path,
          sha: response.sha,
          size: response.size,
          type: 'file'
        }
      ];
    }

    return response.map((entry) => ({
      name: entry.name,
      path: entry.path,
      sha: entry.sha,
      size: entry.size,
      type: entry.type
    }));
  }

  async readTextFile(path: string): Promise<RepoTextFile> {
    const response = await this.getFileContents(path);
    return {
      content: decodeBase64ToText(response.content || ''),
      path: response.path,
      sha: response.sha
    };
  }

  async writeTextFile(input: RepoWriteInput): Promise<RepoWriteResult> {
    const sha = input.sha || (await this.findFileSha(input.path));
    const response = await this.putFile(input.path, {
      branch: this.branch,
      content: encodeBytesToBase64(new TextEncoder().encode(input.content)),
      message: input.message,
      sha
    });

    return {
      commitSha: response.commit?.sha,
      path: response.content?.path || input.path,
      sha: response.content?.sha || sha || ''
    };
  }

  async deleteFile(input: RepoDeleteInput): Promise<void> {
    const sha = input.sha || (await this.findFileSha(input.path));

    if (!sha) {
      throw new Error(`Cannot delete ${input.path} because the file does not exist.`);
    }

    const encodedPath = encodePath(input.path);
    await this.requestJson<GitHubWriteResponse>(`/repos/${this.repo}/contents/${encodedPath}`, {
      body: JSON.stringify({
        branch: this.branch,
        message: input.message,
        sha
      }),
      method: 'DELETE'
    });
  }

  async uploadMedia(input: RepoMediaUploadInput): Promise<RepoWriteResult> {
    const sha = input.sha || (await this.findFileSha(input.path));
    const fileBytes = new Uint8Array(await input.file.arrayBuffer());
    const response = await this.putFile(input.path, {
      branch: this.branch,
      content: encodeBytesToBase64(fileBytes),
      message: input.message,
      sha
    });

    return {
      commitSha: response.commit?.sha,
      path: response.content?.path || input.path,
      sha: response.content?.sha || sha || ''
    };
  }

  async getCurrentUser(): Promise<AdminUser> {
    const response = await this.requestJson<GitHubUserResponse>('/user');
    return {
      avatarUrl: response.avatar_url,
      htmlUrl: response.html_url,
      login: response.login,
      name: response.name || response.login
    };
  }

  async hasWriteAccess() {
    const response = await this.requestJson<GitHubRepositoryResponse>(`/repos/${this.repo}`);
    return Boolean(response.permissions?.push);
  }

  private clearContentRequestCache() {
    const contentsPath = `/repos/${this.repo}/contents`;

    for (const cacheKey of [...this.responseCache.keys()]) {
      if (cacheKey.includes(contentsPath)) {
        this.responseCache.delete(cacheKey);
        this.stalePersistedCacheKeys.delete(cacheKey);
      }
    }

    this.persistResponseCache();
  }

  private createRequestCacheKey(url: string, method: string) {
    return `${method.toUpperCase()}:${url}`;
  }

  private async findFileSha(path: string) {
    try {
      const file = await this.getFileContents(path);
      return file.sha;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('404:')) {
        return undefined;
      }

      throw error;
    }
  }

  private async getFileContents(path: string) {
    const encodedPath = encodePath(path);
    const response = await this.requestJson<GitHubContentsDirectoryItem[] | GitHubContentsFileResponse>(
      `/repos/${this.repo}/contents/${encodedPath}`,
      {
        query: { ref: this.branch }
      }
    );

    if (Array.isArray(response) || response.type !== 'file') {
      throw new Error(`GitHub contents response for ${path} was not a file.`);
    }

    return response;
  }

  private async putFile(
    path: string,
    payload: {
      branch: string;
      content: string;
      message: string;
      sha?: string;
    }
  ) {
    const encodedPath = encodePath(path);
    return this.requestJson<GitHubWriteResponse>(`/repos/${this.repo}/contents/${encodedPath}`, {
      body: JSON.stringify(payload),
      method: 'PUT'
    });
  }

  private async requestJson<T>(
    path: string,
    options: {
      body?: string;
      method?: string;
      query?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const url = new URL(`${this.apiRoot}${path}`);
    for (const [key, value] of Object.entries(options.query || {})) {
      url.searchParams.set(key, value);
    }

    const method = options.method || 'GET';
    const cacheKey = this.createRequestCacheKey(url.toString(), method);
    const shouldUseCache = method === 'GET';
    const cachedEntry = shouldUseCache ? this.responseCache.get(cacheKey) : undefined;
    const shouldRevalidateCachedEntry =
      shouldUseCache &&
      cachedEntry !== undefined &&
      this.stalePersistedCacheKeys.has(cacheKey) &&
      typeof cachedEntry.etag === 'string' &&
      cachedEntry.etag.length > 0;

    if (shouldUseCache) {
      if (cachedEntry !== undefined && !shouldRevalidateCachedEntry) {
        return cachedEntry.value as T;
      }

      const inFlightRequest = this.inFlightRequests.get(cacheKey);
      if (inFlightRequest !== undefined) {
        return (await inFlightRequest) as T;
      }
    }

    const requestPromise = this.fetchJson<T>(url.toString(), {
      body: options.body,
      headers:
        shouldRevalidateCachedEntry && cachedEntry?.etag
          ? {
              'If-None-Match': cachedEntry.etag
            }
          : undefined,
      method
    });

    if (shouldUseCache) {
      this.inFlightRequests.set(cacheKey, requestPromise);
    }

    try {
      const response = await requestPromise;

      if (shouldUseCache) {
        if (response.status === 304 && cachedEntry !== undefined) {
          this.stalePersistedCacheKeys.delete(cacheKey);
          return cachedEntry.value as T;
        }

        this.responseCache.set(cacheKey, {
          etag: response.etag,
          value: response.data
        });
        this.stalePersistedCacheKeys.delete(cacheKey);
        this.persistResponseCache();
      } else if (method === 'DELETE' || method === 'PUT') {
        this.clearContentRequestCache();
      }

      return response.data;
    } finally {
      if (shouldUseCache) {
        this.inFlightRequests.delete(cacheKey);
      }
    }
  }

  private persistResponseCache() {
    if (!this.cacheStore) {
      return;
    }

    try {
      const persistedEntries = [...this.responseCache.entries()].filter(
        ([, value]) => typeof value.etag === 'string' && value.etag.length > 0
      );

      if (persistedEntries.length === 0) {
        this.cacheStore.removeItem(this.responseCacheStorageKey);
        return;
      }

      this.cacheStore.setItem(this.responseCacheStorageKey, JSON.stringify(Object.fromEntries(persistedEntries)));
    } catch {
      this.cacheStore.removeItem(this.responseCacheStorageKey);
    }
  }

  private restorePersistedResponseCache() {
    if (!this.cacheStore) {
      return;
    }

    try {
      const rawValue = this.cacheStore.getItem(this.responseCacheStorageKey);
      if (!rawValue) {
        return;
      }

      const parsedValue = JSON.parse(rawValue) as Record<string, unknown>;
      for (const [cacheKey, cacheValue] of Object.entries(parsedValue)) {
        if (!isCachedGetResponse(cacheValue) || typeof cacheValue.etag !== 'string' || cacheValue.etag.length === 0) {
          continue;
        }

        this.responseCache.set(cacheKey, cacheValue);
        this.stalePersistedCacheKeys.add(cacheKey);
      }
    } catch {
      this.cacheStore.removeItem(this.responseCacheStorageKey);
    }
  }

  private async fetchJson<T>(
    url: string,
    options: {
      body?: string;
      headers?: Record<string, string>;
      method: string;
    }
  ): Promise<{ data: T | null; etag?: string; status: number }> {
    const response = await fetch(url, {
      body: options.body,
      cache: 'no-store',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `${this.authScheme} ${this.token}`,
        'Content-Type': 'application/json; charset=utf-8',
        ...options.headers
      },
      method: options.method
    });

    const responseText = await response.text();
    const parsedPayload = responseText ? (JSON.parse(responseText) as unknown) : null;

    if (!response.ok && response.status !== 304) {
      throw new Error(`${response.status}: ${createErrorMessage(response.status, parsedPayload)}`);
    }

    return {
      data: parsedPayload as T | null,
      etag: response.headers.get('etag') || undefined,
      status: response.status
    };
  }
}
