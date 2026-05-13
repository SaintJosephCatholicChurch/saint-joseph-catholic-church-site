'use client';

import { useAdminFieldSelection } from '../components/adminPreviewSelection';
import { AdminContentSectionPage } from '../components/AdminContentSectionPage';
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
  const [panel, setPanel] = useAdminQueryParamState({
    allowedValues: CONTENT_SECTION_PANELS,
    defaultValue: 'editor',
    paramName: 'churchDetailsPanel'
  });

  function handleSelectFieldKey(fieldKey: ChurchDetailsFieldKey) {
    if (panel === 'preview') {
      setPanel('editor');
    }

    selection.selectFieldKey(fieldKey);
  }

  return (
    <AdminContentSectionPage
      actions={headerActions}
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
