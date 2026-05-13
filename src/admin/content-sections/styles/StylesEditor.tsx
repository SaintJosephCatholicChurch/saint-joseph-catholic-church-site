'use client';

import { AdminImagePathField } from '../../components/AdminImagePathField';

import type { StylesDraft } from '../../content/writableStructuredContent';

interface StylesEditorProps {
  onChange: (value: StylesDraft) => void;
  onSelectFooterBackground: () => void;
  value: StylesDraft;
}

export function StylesEditor({ onChange, onSelectFooterBackground, value }: StylesEditorProps) {
  return (
    <AdminImagePathField
      buttonLabel="Select footer background"
      onSelectImage={onSelectFooterBackground}
      previewAlt="Footer background preview"
      value={value.footerBackground}
    />
  );
}
