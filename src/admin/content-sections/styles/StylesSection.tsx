'use client';

import { AdminContentSectionPage } from '../components/AdminContentSectionPage';
import { StylesEditor } from './StylesEditor';

import type { StylesDraft } from '../../content/writableStructuredContent';
import type { ReactNode } from 'react';

interface StylesSectionProps {
  headerActions: ReactNode;
  onChange: (value: StylesDraft) => void;
  onSelectFooterBackground: () => void;
  value: StylesDraft;
}

export function StylesSection({ headerActions, onChange, onSelectFooterBackground, value }: StylesSectionProps) {
  return (
    <AdminContentSectionPage
      actions={headerActions}
      title="Styles"
      editor={<StylesEditor value={value} onChange={onChange} onSelectFooterBackground={onSelectFooterBackground} />}
    />
  );
}
