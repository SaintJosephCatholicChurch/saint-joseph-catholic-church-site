'use client';

import { useEffect, useRef, useState } from 'react';

import { useAdminFieldSelection } from '../components/adminPreviewSelection';
import { AdminContentSectionPage, useAdminMobileLayout } from '../components/AdminContentSectionPage';
import { useAdminQueryParamState } from '../../useAdminQueryParamState';
import { StaffEditor } from './StaffEditor';
import { StaffPreview } from './StaffPreview';
import { parseStaffFieldKey, type StaffFieldKey } from './fieldKeys';

import type { StaffEntryDraft } from '../../content/writableComplexContent';
import type { ReactNode } from 'react';

interface StaffSectionProps {
  headerActions: ReactNode;
  onChange: (value: StaffEntryDraft[]) => void;
  onSelectImage: (clientId: string) => void;
  value: StaffEntryDraft[];
}

const CONTENT_SECTION_PANELS = ['editor', 'preview'] as const;

export function StaffSection({ headerActions, onChange, onSelectImage, value }: StaffSectionProps) {
  const [expandedClientIds, setExpandedClientIds] = useState<string[]>([]);
  const pendingExpandedFocusFieldKeyRef = useRef<StaffFieldKey | null>(null);
  const pendingPreviewSelectionFieldKeyRef = useRef<StaffFieldKey | null>(null);
  const isMobileLayout = useAdminMobileLayout();
  const [panel, setPanel] = useAdminQueryParamState({
    allowedValues: CONTENT_SECTION_PANELS,
    defaultValue: 'editor',
    paramName: 'staffPanel'
  });
  const selection = useAdminFieldSelection<StaffFieldKey>({
    revealField: (fieldKey) => {
      const parsedFieldKey = parseStaffFieldKey(fieldKey);

      if (!parsedFieldKey) {
        return;
      }

      setExpandedClientIds((currentValue) =>
        currentValue.includes(parsedFieldKey.clientId) ? currentValue : [...currentValue, parsedFieldKey.clientId]
      );
    }
  });

  useEffect(() => {
    const staffClientIds = new Set(value.map((entry) => entry.clientId));
    setExpandedClientIds((currentValue) => currentValue.filter((clientId) => staffClientIds.has(clientId)));
  }, [value]);

  useEffect(() => {
    if (panel !== 'editor' || !pendingPreviewSelectionFieldKeyRef.current) {
      return;
    }

    const fieldKey = pendingPreviewSelectionFieldKeyRef.current;
    pendingPreviewSelectionFieldKeyRef.current = null;
    selectFieldKeyInEditor(fieldKey);
  }, [panel, selection]);

  function selectFieldKeyInEditor(fieldKey: StaffFieldKey) {
    const parsedFieldKey = parseStaffFieldKey(fieldKey);

    if (!parsedFieldKey) {
      return;
    }

    if (expandedClientIds.includes(parsedFieldKey.clientId)) {
      pendingExpandedFocusFieldKeyRef.current = null;
      selection.selectFieldKey(fieldKey);
      return;
    }

    pendingExpandedFocusFieldKeyRef.current = fieldKey;
    selection.setActiveFieldKey(fieldKey);
  }

  function handleSelectFieldKey(fieldKey: StaffFieldKey) {
    if (isMobileLayout && panel === 'preview') {
      pendingPreviewSelectionFieldKeyRef.current = fieldKey;
      setPanel('editor');
      return;
    }

    selectFieldKeyInEditor(fieldKey);
  }

  function handleExpandedEntered(clientId: string) {
    const pendingFieldKey = pendingExpandedFocusFieldKeyRef.current;

    if (!pendingFieldKey) {
      return;
    }

    const parsedFieldKey = parseStaffFieldKey(pendingFieldKey);

    if (!parsedFieldKey || parsedFieldKey.clientId !== clientId) {
      return;
    }

    pendingExpandedFocusFieldKeyRef.current = null;
    requestAnimationFrame(() => {
      selection.selectFieldKey(pendingFieldKey);
    });
  }

  return (
    <AdminContentSectionPage
      actions={headerActions}
      title="Staff"
      panelParamName="staffPanel"
      editor={
        <StaffEditor
          activeFieldKey={selection.activeFieldKey || undefined}
          expandedClientIds={expandedClientIds}
          onChange={onChange}
          onExpandedEntered={handleExpandedEntered}
          onFocusFieldKey={selection.setActiveFieldKey}
          onSelectImage={onSelectImage}
          onToggleExpanded={(clientId, expanded) =>
            setExpandedClientIds((currentValue) => {
              if (expanded) {
                return currentValue.includes(clientId) ? currentValue : [...currentValue, clientId];
              }

              return currentValue.filter((entryId) => entryId !== clientId);
            })
          }
          registerField={selection.registerField}
          value={value}
        />
      }
      preview={
        <StaffPreview
          activeFieldKey={selection.activeFieldKey || undefined}
          draft={value}
          interactive
          onSelectFieldKey={handleSelectFieldKey}
        />
      }
    />
  );
}
