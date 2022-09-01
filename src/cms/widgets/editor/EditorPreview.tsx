import DOMPurify from 'dompurify';
import { CmsWidgetPreviewProps } from 'netlify-cms-core';
import { useMemo } from 'react';

const EditorPreview = ({ value, field }: CmsWidgetPreviewProps<string>) => {
  const sanitizedHtml = field?.get('sanitize_preview', false) ? DOMPurify.sanitize(value) : value;

  return useMemo(
    () => (
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizedHtml
        }}
      />
    ),
    [sanitizedHtml]
  );
};

export default EditorPreview;
