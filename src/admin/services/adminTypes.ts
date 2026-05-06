export type AdminBackendMode = 'connected' | 'preview';

export type AdminAuthStatus = 'restoring' | 'unauthenticated' | 'authenticating' | 'authenticated' | 'error';

export interface AdminUser {
  avatarUrl?: string;
  htmlUrl?: string;
  login: string;
  name: string;
}

export interface AdminAuthSession {
  branch: string;
  mode: AdminBackendMode;
  repo: string;
  restoredAt: string;
  token: string;
  user: AdminUser;
}

export interface RepoDirectoryEntry {
  name: string;
  path: string;
  sha?: string;
  size?: number;
  type: 'dir' | 'file';
}

export interface RepoTextFile {
  content: string;
  path: string;
  sha?: string;
}

export interface RepoWriteInput {
  content: string;
  message: string;
  path: string;
  sha?: string;
}

export interface RepoDeleteInput {
  message: string;
  path: string;
  sha?: string;
}

export interface RepoMediaUploadInput {
  file: Blob;
  message: string;
  path: string;
  sha?: string;
}

export interface RepoWriteResult {
  commitSha?: string;
  path: string;
  sha: string;
}

export interface SessionStoreLike {
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

export interface AdminRepoClient {
  deleteFile(input: RepoDeleteInput): Promise<void>;
  getRepoLabel(): string;
  listFiles(path: string): Promise<RepoDirectoryEntry[]>;
  readTextFile(path: string): Promise<RepoTextFile>;
  uploadMedia(input: RepoMediaUploadInput): Promise<RepoWriteResult>;
  writeTextFile(input: RepoWriteInput): Promise<RepoWriteResult>;
}

export interface AdminAuthAdapter {
  readonly mode: AdminBackendMode;
  createRepoClient(session: AdminAuthSession): AdminRepoClient;
  login(): Promise<AdminAuthSession>;
  logout(): Promise<void>;
  restoreSession(): Promise<AdminAuthSession | null>;
}
