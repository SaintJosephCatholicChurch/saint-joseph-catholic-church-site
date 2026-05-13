'use client';

import { useCallback, useRef, useState } from 'react';

import type { MouseEvent as ReactMouseEvent } from 'react';

export const ADMIN_PREVIEW_FIELD_KEY_ATTRIBUTE = 'data-admin-field-key';

function focusField(element: HTMLElement) {
  element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  element.focus({ preventScroll: true });
}

export function getAdminPreviewFieldTargetProps(fieldKey?: string | null) {
  return fieldKey ? ({ [ADMIN_PREVIEW_FIELD_KEY_ATTRIBUTE]: fieldKey } as Record<string, string>) : {};
}

export function resolveAdminPreviewFieldKey(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  const match = target.closest(`[${ADMIN_PREVIEW_FIELD_KEY_ATTRIBUTE}]`);
  return match?.getAttribute(ADMIN_PREVIEW_FIELD_KEY_ATTRIBUTE) ?? null;
}

interface HandleAdminPreviewSelectionClickOptions<TFieldKey extends string> {
  interactive?: boolean;
  onSelectFieldKey?: (fieldKey: TFieldKey) => void;
}

export function handleAdminPreviewSelectionClick<TFieldKey extends string>(
  event: ReactMouseEvent<HTMLElement>,
  { interactive = false, onSelectFieldKey }: HandleAdminPreviewSelectionClickOptions<TFieldKey>
) {
  if (!interactive) {
    return false;
  }

  const fieldKey = resolveAdminPreviewFieldKey(event.target);

  if (!fieldKey) {
    return false;
  }

  event.preventDefault();
  event.stopPropagation();
  onSelectFieldKey?.(fieldKey as TFieldKey);
  return true;
}

interface UseAdminFieldSelectionOptions<TFieldKey extends string> {
  revealField?: (fieldKey: TFieldKey) => void;
}

interface SelectAdminFieldOptions {
  focus?: boolean;
}

export function useAdminFieldSelection<TFieldKey extends string>({
  revealField
}: UseAdminFieldSelectionOptions<TFieldKey> = {}) {
  const [activeFieldKey, setActiveFieldKeyState] = useState<TFieldKey | null>(null);
  const fieldRegistryRef = useRef(new Map<string, HTMLElement>());
  const pendingFocusFieldKeyRef = useRef<string | null>(null);

  const focusRegisteredField = useCallback(
    (fieldKey: TFieldKey) => {
      pendingFocusFieldKeyRef.current = fieldKey;
      revealField?.(fieldKey);

      const existingField = fieldRegistryRef.current.get(fieldKey);
      if (existingField) {
        focusField(existingField);
        pendingFocusFieldKeyRef.current = null;
      }
    },
    [revealField]
  );

  const registerField = useCallback(
    (fieldKey: TFieldKey) => (element: HTMLElement | null) => {
      if (!element) {
        fieldRegistryRef.current.delete(fieldKey);
        return;
      }

      fieldRegistryRef.current.set(fieldKey, element);

      if (pendingFocusFieldKeyRef.current === fieldKey) {
        focusField(element);
        pendingFocusFieldKeyRef.current = null;
      }
    },
    []
  );

  const setActiveFieldKey = useCallback(
    (fieldKey: TFieldKey | null, options?: SelectAdminFieldOptions) => {
      setActiveFieldKeyState(fieldKey);

      if (!fieldKey) {
        return;
      }

      if (options?.focus) {
        focusRegisteredField(fieldKey);
        return;
      }

      revealField?.(fieldKey);
    },
    [focusRegisteredField, revealField]
  );

  const selectFieldKey = useCallback(
    (fieldKey: TFieldKey, options?: SelectAdminFieldOptions) => {
      setActiveFieldKey(fieldKey, { focus: options?.focus ?? true });
    },
    [setActiveFieldKey]
  );

  return {
    activeFieldKey,
    registerField,
    selectFieldKey,
    setActiveFieldKey
  };
}
