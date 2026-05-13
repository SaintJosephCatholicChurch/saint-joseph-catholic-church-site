'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { createConnectedAdminBackend, createPreviewAdminBackend } from './services/adminBackends';

import type { ReactNode } from 'react';
import type { AdminAuthAdapter, AdminAuthSession, AdminAuthStatus, AdminBackendMode, AdminRepoClient } from './services/adminTypes';

type AdminAuthContextValue = {
  authStatus: AdminAuthStatus;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  repoClient: AdminRepoClient | null;
  restoreSession: () => Promise<void>;
  session: AdminAuthSession | null;
  startPreview: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function buildErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'The admin service layer hit an unexpected error.';
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const backends = useMemo<Record<AdminBackendMode, AdminAuthAdapter>>(
    () => ({
      connected: createConnectedAdminBackend(),
      preview: createPreviewAdminBackend()
    }),
    []
  );

  const [authStatus, setAuthStatus] = useState<AdminAuthStatus>('restoring');
  const [session, setSession] = useState<AdminAuthSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getRequestedMode = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const value = new URLSearchParams(window.location.search).get('mode');
    return value === 'preview' ? 'preview' : null;
  }, []);

  const restoreSession = useCallback(async () => {
    setAuthStatus('restoring');
    setError(null);

    try {
      const requestedMode = getRequestedMode();
      const backendOrder: AdminBackendMode[] = requestedMode === 'preview' ? ['preview'] : ['connected', 'preview'];
      let restoredSession: AdminAuthSession | null = null;

      for (const mode of backendOrder) {
        restoredSession = await backends[mode].restoreSession();

        if (restoredSession) {
          break;
        }
      }

      setSession(restoredSession);
      setAuthStatus(restoredSession ? 'authenticated' : 'unauthenticated');
    } catch (restoreError) {
      setSession(null);
      setAuthStatus('error');
      setError(buildErrorMessage(restoreError));
    }
  }, [backends, getRequestedMode]);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const login = useCallback(async () => {
    setAuthStatus('authenticating');
    setError(null);

    try {
      const nextSession = await backends.connected.login();
      setSession(nextSession);
      setAuthStatus('authenticated');
    } catch (loginError) {
      setSession(null);
      setAuthStatus('error');
      setError(buildErrorMessage(loginError));
    }
  }, [backends]);

  const startPreview = useCallback(async () => {
    setAuthStatus('authenticating');
    setError(null);

    try {
      const nextSession = await backends.preview.login();
      setSession(nextSession);
      setAuthStatus('authenticated');
    } catch (previewError) {
      setSession(null);
      setAuthStatus('error');
      setError(buildErrorMessage(previewError));
    }
  }, [backends]);

  const logout = useCallback(async () => {
    await Promise.all([backends.connected.logout(), backends.preview.logout()]);
    setSession(null);
    setError(null);
    setAuthStatus('unauthenticated');
  }, [backends]);

  const repoClient = useMemo<AdminRepoClient | null>(() => {
    if (!session) {
      return null;
    }

    return backends[session.mode].createRepoClient(session);
  }, [backends, session]);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      authStatus,
      error,
      login,
      logout,
      repoClient,
      restoreSession,
      session,
      startPreview
    }),
    [authStatus, error, login, logout, repoClient, restoreSession, session, startPreview]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider.');
  }

  return context;
}
