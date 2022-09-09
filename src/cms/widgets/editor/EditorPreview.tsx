import DOMPurify from 'dompurify';
import { Map } from 'immutable';
import { CmsWidgetPreviewProps } from 'netlify-cms-core';
import { useEffect, useMemo, useState } from 'react';
import { doesUrlFileExist } from '../../../util/fetch.util';
import { isNotNullish } from '../../../util/null.util';

function getFieldAsset(field: Map<string, any>, getAsset: (path: string, field: Map<string, any>) => string) {
  return (url: string) => {
    const asset = getAsset(url, field);
    if (isNotNullish(asset)) {
      return asset;
    }

    return getAsset(url.replace(/^\//g, ''), field);
  };
}

async function fromStorageToEditor(value: string, getAsset: (path: string) => string): Promise<string> {
  let newValue = value;

  const regex = /<img(?:[\w\W]+?)src="([\w\W]+?)"(?:[\w\W]+?)[\/]{0,1}>/g;
  let match = regex.exec(newValue);
  while (match && match.length === 2) {
    if (await doesUrlFileExist(match[1])) {
      match = regex.exec(newValue);
      continue;
    }

    const asset = getAsset(match[1]);
    if (isNotNullish(asset)) {
      const newImage = match[0].replace(match[1], asset).replace(/^<img/g, `<img data-asset="${match[1]}"`);
      newValue = newValue.replaceAll(match[0], newImage);
    }
    match = regex.exec(newValue);
  }

  return newValue;
}

type EditorPreviewProps = Omit<CmsWidgetPreviewProps<string>, 'getAsset'> & {
  getAsset: (path: string, field: Map<string, any>) => string;
};

const EditorPreview = ({ value, field, getAsset }: EditorPreviewProps) => {
  const sanitizedHtml = field?.get('sanitize_preview', false) ? DOMPurify.sanitize(value) : value;

  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    let alive = true;

    const getPreviewHtml = async () => {
      const processedHtml = await fromStorageToEditor(sanitizedHtml, getFieldAsset(field, getAsset));
      if (alive) {
        setHtml(processedHtml);
      }
    };

    getPreviewHtml();

    return () => {
      alive = false;
    };
  }, [field, getAsset, sanitizedHtml]);

  return useMemo(
    () => (
      <div
        dangerouslySetInnerHTML={{
          __html: html
        }}
      />
    ),
    [html]
  );
};

export default EditorPreview;
