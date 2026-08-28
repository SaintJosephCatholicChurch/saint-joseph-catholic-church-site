'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';

const UNSAVED_CHANGES_MESSAGE = 'You have unsaved changes. Leave this page and discard them?';

type AdminUnsavedChangesContextValue = {
  confirmIfDirty: () => boolean;
  registerDirty: (ownerId: string, isDirty: boolean) => void;
};

const AdminUnsavedChangesContext = createContext<AdminUnsavedChangesContextValue | null>(null);

export function AdminUnsavedChangesProvider({ children }: { children: ReactNode }) {
  const dirtyOwnersRef = useRef(new Set<string>());

  const registerDirty = useCallback((ownerId: string, isDirty: boolean) => {
    if (isDirty) {
      dirtyOwnersRef.current.add(ownerId);
      return;
    }

    dirtyOwnersRef.current.delete(ownerId);
  }, []);

  const isAnythingDirty = useCallback(() => dirtyOwnersRef.current.size > 0, []);

  const confirmIfDirty = useCallback(() => {
    if (!isAnythingDirty()) {
      return true;
    }

    return window.confirm(UNSAVED_CHANGES_MESSAGE);
  }, [isAnythingDirty]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!isAnythingDirty()) {
        return;
      }

      event.preventDefault();
      event.returnValue = UNSAVED_CHANGES_MESSAGE;
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isAnythingDirty]);

  const value = useMemo(
    () => ({
      confirmIfDirty,
      registerDirty
    }),
    [confirmIfDirty, registerDirty]
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
