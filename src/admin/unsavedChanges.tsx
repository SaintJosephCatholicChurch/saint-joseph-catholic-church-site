'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';

const UNSAVED_CHANGES_MESSAGE = 'You have unsaved changes. Leave this page and discard them?';
const ADMIN_UNSAVED_GUARD_KEY = 'adminUnsavedGuard';

type AdminHistoryState = {
  [ADMIN_UNSAVED_GUARD_KEY]?: boolean;
};

type AdminUnsavedChangesContextValue = {
  confirmIfDirty: () => boolean;
  consumeAllowedNavigation: () => boolean;
  registerDirty: (ownerId: string, isDirty: boolean) => void;
};

const AdminUnsavedChangesContext = createContext<AdminUnsavedChangesContextValue | null>(null);

function getHistoryState(): AdminHistoryState {
  const state = window.history.state;
  return state && typeof state === 'object' ? (state as AdminHistoryState) : {};
}

function hasUnsavedGuardState() {
  return getHistoryState()[ADMIN_UNSAVED_GUARD_KEY] === true;
}

export function AdminUnsavedChangesProvider({ children }: { children: ReactNode }) {
  const dirtyOwnersRef = useRef(new Set<string>());
  const allowedNavigationRef = useRef(false);
  const skipGuardPopRef = useRef(false);
  const ignoreNextPopStateRef = useRef(false);
  const guardPushedRef = useRef(false);

  const isAnythingDirty = useCallback(() => dirtyOwnersRef.current.size > 0, []);

  const confirmIfDirty = useCallback(() => {
    if (!isAnythingDirty()) {
      return true;
    }

    const confirmed = window.confirm(UNSAVED_CHANGES_MESSAGE);

    if (confirmed) {
      allowedNavigationRef.current = true;
      skipGuardPopRef.current = true;
    }

    return confirmed;
  }, [isAnythingDirty]);

  const consumeAllowedNavigation = useCallback(() => {
    const allowed = allowedNavigationRef.current;
    allowedNavigationRef.current = false;
    return allowed;
  }, []);

  const syncHistoryGuard = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const dirty = dirtyOwnersRef.current.size > 0;

    if (dirty && !guardPushedRef.current) {
      window.history.pushState({ ...getHistoryState(), [ADMIN_UNSAVED_GUARD_KEY]: true }, '', window.location.href);
      guardPushedRef.current = true;
      return;
    }

    if (dirty || !guardPushedRef.current) {
      return;
    }

    if (skipGuardPopRef.current) {
      skipGuardPopRef.current = false;

      if (hasUnsavedGuardState()) {
        window.history.replaceState({ ...getHistoryState(), [ADMIN_UNSAVED_GUARD_KEY]: false }, '', window.location.href);
      }

      guardPushedRef.current = false;
      return;
    }

    if (hasUnsavedGuardState()) {
      ignoreNextPopStateRef.current = true;
      window.history.back();
    }

    guardPushedRef.current = false;
  }, []);

  const registerDirty = useCallback(
    (ownerId: string, isDirty: boolean) => {
      if (isDirty) {
        dirtyOwnersRef.current.add(ownerId);
      } else {
        dirtyOwnersRef.current.delete(ownerId);
      }

      syncHistoryGuard();
    },
    [syncHistoryGuard]
  );

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!isAnythingDirty()) {
        return;
      }

      event.preventDefault();
      event.returnValue = UNSAVED_CHANGES_MESSAGE;
    }

    function handlePopState() {
      if (ignoreNextPopStateRef.current) {
        ignoreNextPopStateRef.current = false;
        return;
      }

      if (!isAnythingDirty()) {
        guardPushedRef.current = false;
        return;
      }

      if (!window.confirm(UNSAVED_CHANGES_MESSAGE)) {
        window.history.pushState({ ...getHistoryState(), [ADMIN_UNSAVED_GUARD_KEY]: true }, '', window.location.href);
        guardPushedRef.current = true;
        return;
      }

      allowedNavigationRef.current = true;
      skipGuardPopRef.current = true;
      dirtyOwnersRef.current.clear();
      guardPushedRef.current = false;
      window.history.back();
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAnythingDirty]);

  const value = useMemo(
    () => ({
      confirmIfDirty,
      consumeAllowedNavigation,
      registerDirty
    }),
    [confirmIfDirty, consumeAllowedNavigation, registerDirty]
  );

  return <AdminUnsavedChangesContext.Provider value={value}>{children}</AdminUnsavedChangesContext.Provider>;
}

export function useAdminUnsavedChanges() {
  const context = useContext(AdminUnsavedChangesContext);

  if (!context) {
    throw new Error('useAdminUnsavedChanges must be used within an AdminUnsavedChangesProvider.');
  }

  return context;
}

export function useRegisterAdminDirty(ownerId: string, isDirty: boolean) {
  const { registerDirty } = useAdminUnsavedChanges();

  useEffect(() => {
    registerDirty(ownerId, isDirty);
    return () => registerDirty(ownerId, false);
  }, [isDirty, ownerId, registerDirty]);
}
