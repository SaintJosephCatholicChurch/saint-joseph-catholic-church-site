import { ADMIN_AUTH, ADMIN_REPOSITORY, ADMIN_SESSION_KEYS } from '../adminConfig';
import { GitHubRepoClient } from './githubRepoClient';
import { NetlifyAuthError, NetlifyGitHubAuthenticator } from './netlifyGitHubAuth';
import { PreviewRepoClient } from './previewRepoClient';

import type { AdminAuthAdapter, AdminAuthSession, SessionStoreLike } from './adminTypes';

function getDefaultBrowserStorage(): SessionStoreLike | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

function getDefaultBrowserSessionStorage(): SessionStoreLike | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage;
}

function readStoredSession(storage: SessionStoreLike | null, key: string) {
  if (!storage) {
    return null;
  }

  const rawSession = storage.getItem(key);
  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AdminAuthSession;
  } catch {
    storage.removeItem(key);
    return null;
  }
}

function writeStoredSession(storage: SessionStoreLike | null, key: string, session: AdminAuthSession | null) {
  if (!storage) {
    return;
  }

  if (!session) {
    storage.removeItem(key);
    return;
  }

  storage.setItem(key, JSON.stringify(session));
}

function clearStoredSessions(storage: SessionStoreLike | null, keys: string[]) {
  if (!storage) {
    return;
  }

  for (const key of keys) {
    storage.removeItem(key);
  }
}

function normalizeAuthScope(scope: string | null | undefined) {
  return (scope || '').trim();
}

export function createConnectedAdminBackend(
  storage: SessionStoreLike | null = getDefaultBrowserStorage()
): AdminAuthAdapter {
  const authenticator = new NetlifyGitHubAuthenticator({
    authEndpoint: ADMIN_AUTH.authEndpoint,
    baseUrl: ADMIN_AUTH.baseUrl,
    siteId: ADMIN_AUTH.siteId
  });
  const cacheStore = getDefaultBrowserSessionStorage();

  const createRepoClient = (session: AdminAuthSession) =>
    new GitHubRepoClient({
      apiRoot: ADMIN_REPOSITORY.apiRoot,
      branch: session.branch,
      cacheStore,
      repo: session.repo,
      token: session.token
    });

  const buildSession = async (token: string) => {
    const repoClient = new GitHubRepoClient({
      apiRoot: ADMIN_REPOSITORY.apiRoot,
      branch: ADMIN_REPOSITORY.branch,
      cacheStore,
      repo: ADMIN_REPOSITORY.repo,
      token
    });

    const [user, hasWriteAccess] = await Promise.all([repoClient.getCurrentUser(), repoClient.hasWriteAccess()]);

    if (!hasWriteAccess) {
      throw new Error('Your GitHub account does not have push access to the site repository.');
    }

    const session: AdminAuthSession = {
      authScope: normalizeAuthScope(ADMIN_AUTH.authScope),
      branch: ADMIN_REPOSITORY.branch,
      mode: 'connected',
      repo: ADMIN_REPOSITORY.repo,
      restoredAt: new Date().toISOString(),
      token,
      user
    };

    clearStoredSessions(storage, [ADMIN_SESSION_KEYS.preview]);
    writeStoredSession(storage, ADMIN_SESSION_KEYS.connected, session);
    return session;
  };

  return {
    mode: 'connected',
    createRepoClient,
    async login() {
      const authResponse = await authenticator.authenticate({
        provider: 'github',
        scope: ADMIN_AUTH.authScope || undefined
      });

      if (!authResponse.token) {
        throw new NetlifyAuthError('GitHub authentication completed without a token.');
      }

      return buildSession(authResponse.token);
    },
    logout() {
      clearStoredSessions(storage, [ADMIN_SESSION_KEYS.connected, ADMIN_SESSION_KEYS.preview]);
      return Promise.resolve();
    },
    async restoreSession() {
      const storedSession = readStoredSession(storage, ADMIN_SESSION_KEYS.connected);

      if (!storedSession?.token) {
        return null;
      }

      if (normalizeAuthScope(storedSession.authScope) !== normalizeAuthScope(ADMIN_AUTH.authScope)) {
        clearStoredSessions(storage, [ADMIN_SESSION_KEYS.connected]);
        return null;
      }

      try {
        return await buildSession(storedSession.token);
      } catch {
        clearStoredSessions(storage, [ADMIN_SESSION_KEYS.connected]);
        return null;
      }
    }
  };
}

export function createPreviewAdminBackend(
  storage: SessionStoreLike | null = getDefaultBrowserStorage()
): AdminAuthAdapter {
  const createRepoClient = () => new PreviewRepoClient();

  const buildSession = () => {
    const session: AdminAuthSession = {
      authScope: '',
      branch: 'preview',
      mode: 'preview',
      repo: 'local-preview',
      restoredAt: new Date().toISOString(),
      token: '',
      user: {
        login: 'preview',
        name: 'Preview mode'
      }
    };

    clearStoredSessions(storage, [ADMIN_SESSION_KEYS.connected]);
    writeStoredSession(storage, ADMIN_SESSION_KEYS.preview, session);
    return session;
  };

  return {
    mode: 'preview',
    createRepoClient,
    login() {
      return Promise.resolve(buildSession());
    },
    logout() {
      clearStoredSessions(storage, [ADMIN_SESSION_KEYS.preview]);
      return Promise.resolve();
    },
    restoreSession() {
      const storedSession = readStoredSession(storage, ADMIN_SESSION_KEYS.preview);

      if (!storedSession || storedSession.mode !== 'preview') {
        return Promise.resolve(null);
      }

      return Promise.resolve(buildSession());
    }
  };
}
