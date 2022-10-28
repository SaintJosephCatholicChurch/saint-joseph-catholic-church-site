import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';

import { doesUrlFileExist } from '../../../util/fetch.util';
import { isNotNullish } from '../../../util/null.util';
import { getFieldAsset } from '../../util/asset.util';

import type { Map } from 'immutable';
import type { CmsWidgetPreviewProps } from '@staticcms/core';

async function fromStorageToEditor(
  value: string,
  getAsset: (path: string) => string,
  cache: Record<string, boolean>
): Promise<{ result: string; cache: Record<string, boolean> }> {
  let newValue = value;

  const imageRegex = /<img(?:[\w\W]+?)src="([\w\W]+?)"(?:[\w\W]+?)[/]{0,1}>/g;
  let imageMatch = imageRegex.exec(newValue);
  while (imageMatch && imageMatch.length === 2) {
    if (imageMatch[1] in cache ? cache[imageMatch[1]] : (await doesUrlFileExist(imageMatch[1])).exists) {
      cache[imageMatch[1]] = true;
      imageMatch = imageRegex.exec(newValue);
      continue;
    }

    cache[imageMatch[1]] = false;
    const asset = getAsset(imageMatch[1]);
    if (isNotNullish(asset)) {
      const newImage = imageMatch[0]
        .replace(imageMatch[1], asset)
        .replace(/^<img/g, `<img data-asset="${imageMatch[1]}"`);
      newValue = newValue.replaceAll(imageMatch[0], newImage);
    }
    imageMatch = imageRegex.exec(newValue);
  }

  const fileRegex = /<a(?:[\w\W]+?)href="([\w\W]+?)"(?:[\w\W]+?)>(?:[\w\W]+?)<\/a>/g;
  let fileMatch = fileRegex.exec(newValue);
  while (fileMatch && fileMatch.length === 2) {
    if (fileMatch[1] in cache ? cache[fileMatch[1]] : (await doesUrlFileExist(fileMatch[1])).exists) {
      cache[fileMatch[1]] = true;
      fileMatch = fileRegex.exec(newValue);
      continue;
    }

    cache[fileMatch[1]] = false;
    const asset = getAsset(fileMatch[1]);
    if (isNotNullish(asset)) {
      const newImage = fileMatch[0].replace(fileMatch[1], asset).replace(/^<a/g, `<a data-asset="${fileMatch[1]}"`);
      newValue = newValue.replaceAll(fileMatch[0], newImage);
    }
    fileMatch = fileRegex.exec(newValue);
  }

  return { result: newValue, cache };
}

function useStorageToEditor(
  input: string,
  field: Map<string, any>,
  getAsset: (path: string, field: Map<string, any>) => string
) {
  const [html, setHtml] = useState<string>('');
  const [fileCheckCache, setFileCheckCache] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let alive = true;

    const getPreviewHtml = async () => {
      const { result: processedHtml, cache } = await fromStorageToEditor(
        input,
        getFieldAsset(field, getAsset),
        fileCheckCache
      );
      if (alive && html !== processedHtml) {
        setHtml(processedHtml);
        setFileCheckCache(cache);
      }
    };

    getPreviewHtml();

    return () => {
      alive = false;
    };
  }, [field, fileCheckCache, getAsset, html, input]);

  return html;
}

type EditorPreviewProps = Omit<CmsWidgetPreviewProps<string>, 'getAsset'> & {
  getAsset: (path: string, field: Map<string, any>) => string;
};

const EditorPreview = ({ value, field, getAsset }: EditorPreviewProps) => {
  const sanitizedHtml = (field?.get('sanitize_preview', false) ? DOMPurify.sanitize(value) : value) as string;
  const html = useStorageToEditor(sanitizedHtml, field, getAsset);

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
