'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { createPreviewAdminBackend, createConnectedAdminBackend } from './services/adminBackends';

import type { ReactNode } from 'react';
import type {
  AdminAuthAdapter,
  AdminAuthSession,
  AdminAuthStatus,
  AdminBackendMode,
  AdminRepoClient
} from './services/adminTypes';

type AdminAuthContextValue = {
  authStatus: AdminAuthStatus;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  mode: AdminBackendMode;
  repoClient: AdminRepoClient | null;
  restoreSession: () => Promise<void>;
  session: AdminAuthSession | null;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function buildErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'The admin service layer hit an unexpected error.';
}

export function AdminAuthProvider({ children, mode }: { children: ReactNode; mode: AdminBackendMode }) {
  const backend = useMemo<AdminAuthAdapter>(() => {
    if (mode === 'preview') {
      return createPreviewAdminBackend();
    }

    return createConnectedAdminBackend();
  }, [mode]);

  const [authStatus, setAuthStatus] = useState<AdminAuthStatus>('restoring');
  const [session, setSession] = useState<AdminAuthSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const restoreSession = useCallback(async () => {
    setAuthStatus('restoring');
    setError(null);

    try {
      const restoredSession = await backend.restoreSession();
      setSession(restoredSession);
      setAuthStatus(restoredSession ? 'authenticated' : 'unauthenticated');
    } catch (restoreError) {
      setSession(null);
      setAuthStatus('error');
      setError(buildErrorMessage(restoreError));
    }
  }, [backend]);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const login = useCallback(async () => {
    setAuthStatus('authenticating');
    setError(null);

    try {
      const nextSession = await backend.login();
      setSession(nextSession);
      setAuthStatus('authenticated');
    } catch (loginError) {
      setSession(null);
      setAuthStatus('error');
      setError(buildErrorMessage(loginError));
    }
  }, [backend]);

  const logout = useCallback(async () => {
    await backend.logout();
    setSession(null);
    setError(null);
    setAuthStatus('unauthenticated');
  }, [backend]);

  const repoClient = useMemo<AdminRepoClient | null>(() => {
    if (!session) {
      return null;
    }

    return backend.createRepoClient(session);
  }, [backend, session]);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      authStatus,
      error,
      login,
      logout,
      mode,
      repoClient,
      restoreSession,
      session
    }),
    [authStatus, error, login, logout, mode, repoClient, restoreSession, session]
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
