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

  const imageRegex = /<img(?:[\w\W]+?)src="([\w\W]+?)"(?:[\w\W]+?)[\/]{0,1}>/g;
  let imageMatch = imageRegex.exec(newValue);
  while (imageMatch && imageMatch.length === 2) {
    if (await doesUrlFileExist(imageMatch[1])) {
      imageMatch = imageRegex.exec(newValue);
      continue;
    }

    const asset = getAsset(imageMatch[1]);
    if (isNotNullish(asset)) {
      const newImage = imageMatch[0].replace(imageMatch[1], asset).replace(/^<img/g, `<img data-asset="${imageMatch[1]}"`);
      newValue = newValue.replaceAll(imageMatch[0], newImage);
    }
    imageMatch = imageRegex.exec(newValue);
  }

  const fileRegex = /<a(?:[\w\W]+?)href="([\w\W]+?)"(?:[\w\W]+?)>(?:[\w\W]+?)<\/a>/g;
  let fileMatch = fileRegex.exec(newValue);
  while (fileMatch && fileMatch.length === 2) {
    if (await doesUrlFileExist(fileMatch[1])) {
      fileMatch = fileRegex.exec(newValue);
      continue;
    }

    const asset = getAsset(fileMatch[1]);
    if (isNotNullish(asset)) {
      const newImage = fileMatch[0].replace(fileMatch[1], asset).replace(/^<a/g, `<a data-asset="${fileMatch[1]}"`);
      newValue = newValue.replaceAll(fileMatch[0], newImage);
    }
    fileMatch = fileRegex.exec(newValue);
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
      if (alive && html !== processedHtml) {
        setHtml(processedHtml);
      }
    };

    getPreviewHtml();

    return () => {
      alive = false;
    };
  }, [field, getAsset, html, sanitizedHtml]);

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
