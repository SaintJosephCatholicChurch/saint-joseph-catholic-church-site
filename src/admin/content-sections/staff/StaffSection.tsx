'use client';

import { useEffect, useRef, useState } from 'react';

import { useAdminFieldSelection } from '../components/adminPreviewSelection';
import { AdminContentSectionPage } from '../components/AdminContentSectionPage';
import { useAdminQueryParamState } from '../../useAdminQueryParamState';
import { StaffEditor } from './StaffEditor';
import { StaffPreview } from './StaffPreview';
import { parseStaffFieldKey, type StaffFieldKey } from './fieldKeys';

import type { StaffEntryDraft } from '../../content/writableComplexContent';
import type { ReactNode } from 'react';

interface StaffSectionProps {
  headerActions: ReactNode;
  onChange: (value: StaffEntryDraft[]) => void;
  onSelectImage: (index: number) => void;
  value: StaffEntryDraft[];
}

const CONTENT_SECTION_PANELS = ['editor', 'preview'] as const;

export function StaffSection({ headerActions, onChange, onSelectImage, value }: StaffSectionProps) {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const pendingExpandedFocusFieldKeyRef = useRef<StaffFieldKey | null>(null);
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

      setExpandedIndexes((currentValue) =>
        currentValue.includes(parsedFieldKey.index) ? currentValue : [...currentValue, parsedFieldKey.index]
      );
    }
  });

  useEffect(() => {
    setExpandedIndexes((currentValue) => currentValue.filter((index) => index < value.length));
  }, [value.length]);

  function handleSelectFieldKey(fieldKey: StaffFieldKey) {
    if (panel === 'preview') {
      setPanel('editor');
    }

    const parsedFieldKey = parseStaffFieldKey(fieldKey);

    if (!parsedFieldKey) {
      return;
    }

    const isExpanded = expandedIndexes.includes(parsedFieldKey.index);

    if (isExpanded) {
      pendingExpandedFocusFieldKeyRef.current = null;
      selection.selectFieldKey(fieldKey);
      return;
    }

    pendingExpandedFocusFieldKeyRef.current = fieldKey;
    selection.setActiveFieldKey(fieldKey);
  }

  function handleExpandedEntered(index: number) {
    const pendingFieldKey = pendingExpandedFocusFieldKeyRef.current;

    if (!pendingFieldKey) {
      return;
    }

    const parsedFieldKey = parseStaffFieldKey(pendingFieldKey);

    if (!parsedFieldKey || parsedFieldKey.index !== index) {
      return;
    }

    pendingExpandedFocusFieldKeyRef.current = null;
    selection.selectFieldKey(pendingFieldKey);
  }

  return (
    <AdminContentSectionPage
      actions={headerActions}
      title="Staff"
      panelParamName="staffPanel"
      editor={
        <StaffEditor
          activeFieldKey={selection.activeFieldKey || undefined}
          expandedIndexes={expandedIndexes}
          onChange={onChange}
          onExpandedEntered={handleExpandedEntered}
          onFocusFieldKey={selection.setActiveFieldKey}
          onSelectImage={onSelectImage}
          onToggleExpanded={(index, expanded) =>
            setExpandedIndexes((currentValue) => {
              if (expanded) {
                return currentValue.includes(index) ? currentValue : [...currentValue, index];
              }

              return currentValue.filter((entryIndex) => entryIndex !== index);
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
