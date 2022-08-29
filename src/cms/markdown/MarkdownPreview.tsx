import DOMPurify from 'dompurify';
import { WidgetPreviewContainer } from 'netlify-cms-ui-default';
import React from 'react';
import { markdownToHtml } from './serializers';

interface MarkdownPreviewProps {
  value?: string;
  field?: any;
  getAsset: () => any;
  resolveWidget: () => any;
  getRemarkPlugins?: () => any[];
}

const MarkdownPreview = ({ value, getAsset, resolveWidget, field, getRemarkPlugins }: MarkdownPreviewProps) => {
  if (value === null) {
    return null;
  }

  const html = markdownToHtml(value, { getAsset, resolveWidget, remarkPlugins: getRemarkPlugins?.() });
  const toRender = field?.get('sanitize_preview', false) ? DOMPurify.sanitize(html) : html;

  return (
    <WidgetPreviewContainer>
      <div
        dangerouslySetInnerHTML={{
          __html: toRender
        }}
      />
    </WidgetPreviewContainer>
  );
};

export default MarkdownPreview;
