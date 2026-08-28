'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getPreviewMediaBlob, listPreviewMediaPaths, repoPathToPublicPath } from './services/previewMediaStore';

const PreviewMediaUrlContext = createContext<Record<string, string>>({});

export function PreviewMediaUrlProvider({ children }: { children: ReactNode }) {
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];

    async function loadPreviewMediaUrls() {
      objectUrls.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
      objectUrls.length = 0;

      const paths = await listPreviewMediaPaths();
      const nextUrls: Record<string, string> = {};

      for (const path of paths) {
        const blob = await getPreviewMediaBlob(path);

        if (!blob) {
          continue;
        }

        const objectUrl = URL.createObjectURL(blob);
        objectUrls.push(objectUrl);
        nextUrls[path] = objectUrl;
        nextUrls[repoPathToPublicPath(path)] = objectUrl;
      }

      if (!cancelled) {
        setUrls(nextUrls);
      }
    }

    void loadPreviewMediaUrls();

    function handlePreviewMediaUpdated() {
      void loadPreviewMediaUrls();
    }

    window.addEventListener('admin-preview-media-updated', handlePreviewMediaUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener('admin-preview-media-updated', handlePreviewMediaUpdated);
      objectUrls.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
    };
  }, []);

  const value = useMemo(() => urls, [urls]);

  return <PreviewMediaUrlContext.Provider value={value}>{children}</PreviewMediaUrlContext.Provider>;
}

export function useResolvedMediaSrc(path: string) {
  const urls = useContext(PreviewMediaUrlContext);
  const trimmedPath = path.trim();

  if (!trimmedPath) {
    return trimmedPath;
  }

  return urls[trimmedPath] || urls[repoPathToPublicPath(trimmedPath)] || trimmedPath;
}
