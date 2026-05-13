'use client';

import { AdminContentSectionPage } from '../components/AdminContentSectionPage';
import { SiteConfigEditor } from './SiteConfigEditor';

import type { SiteConfigDraft } from '../../content/writableStructuredContent';
import type { ReactNode } from 'react';

interface SiteConfigSectionProps {
  headerActions: ReactNode;
  onChange: (value: SiteConfigDraft) => void;
  onSelectSiteImage: () => void;
  value: SiteConfigDraft;
}

export function SiteConfigSection({ headerActions, onChange, onSelectSiteImage, value }: SiteConfigSectionProps) {
  return (
    <AdminContentSectionPage
      actions={headerActions}
      title="Site Config"
      editor={<SiteConfigEditor value={value} onChange={onChange} onSelectSiteImage={onSelectSiteImage} />}
    />
  );
}
