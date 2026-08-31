'use client';

import { useEffect, useRef } from 'react';

import { useAdminFieldSelection } from '../components/adminPreviewSelection';
import { AdminContentSectionPage, useAdminMobileLayout } from '../components/AdminContentSectionPage';
import { ChurchDetailsEditor } from './ChurchDetailsEditor';
import { ChurchDetailsSectionPreview } from './ChurchDetailsPreview';
import { useAdminQueryParamState } from '../../useAdminQueryParamState';
import type { ChurchDetailsFieldKey } from './fieldKeys';

import type { ChurchDetailsDraft } from '../../content/writableStructuredContent';
import type { ReactNode } from 'react';

interface ChurchDetailsSectionProps {
  headerActions: ReactNode;
  onChange: (value: ChurchDetailsDraft) => void;
  showPreview: boolean;
  value: ChurchDetailsDraft;
}

const CONTENT_SECTION_PANELS = ['editor', 'preview'] as const;

export function ChurchDetailsSection({ headerActions, onChange, showPreview, value }: ChurchDetailsSectionProps) {
  const selection = useAdminFieldSelection<ChurchDetailsFieldKey>();
  const pendingPreviewSelectionFieldKeyRef = useRef<ChurchDetailsFieldKey | null>(null);
  const isMobileLayout = useAdminMobileLayout();
  const [panel, setPanel] = useAdminQueryParamState({
    allowedValues: CONTENT_SECTION_PANELS,
    defaultValue: 'editor',
    paramName: 'churchDetailsPanel'
  });

  useEffect(() => {
    if (panel !== 'editor' || !pendingPreviewSelectionFieldKeyRef.current) {
      return;
    }

    const fieldKey = pendingPreviewSelectionFieldKeyRef.current;
    pendingPreviewSelectionFieldKeyRef.current = null;
    selection.selectFieldKey(fieldKey);
  }, [panel, selection]);

  function handleSelectFieldKey(fieldKey: ChurchDetailsFieldKey) {
    if (isMobileLayout && panel === 'preview') {
      pendingPreviewSelectionFieldKeyRef.current = fieldKey;
      setPanel('editor');
      return;
    }

    selection.selectFieldKey(fieldKey);
  }

  return (
    <AdminContentSectionPage
      actions={headerActions}
      description="This preview shows Contact page fields. Mission, vision, and online giving appear in the site header and footer."
      title="Church Details"
      panelParamName="churchDetailsPanel"
      editor={
        <ChurchDetailsEditor
          value={value}
          onChange={onChange}
          onFocusFieldKey={selection.setActiveFieldKey}
          registerField={selection.registerField}
        />
      }
      preview={
        showPreview ? (
          <ChurchDetailsSectionPreview
            activeFieldKey={selection.activeFieldKey || undefined}
            interactive
            onSelectFieldKey={handleSelectFieldKey}
            value={value}
          />
        ) : undefined
      }
    />
  );
}
