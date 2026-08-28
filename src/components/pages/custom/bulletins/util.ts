import { format, parse } from 'date-fns';
import { useMemo } from 'react';

import type { Bulletin } from '../../../../interface';

export function normalizeBulletinPdfPath(pdfPath: string): string {
  const publicRelativePath = pdfPath
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/^(?:public\/)+/, '');
  return `/${publicRelativePath}`;
}

export function getBulletinPdfPaths(bulletin: Pick<Bulletin, 'pdf' | 'pdfs'> | undefined): string[] {
  if (!bulletin) {
    return [];
  }

  const fromArray = (bulletin.pdfs ?? []).map((path) => path?.trim()).filter((path): path is string => Boolean(path));
  if (fromArray.length > 0) {
    return fromArray.map(normalizeBulletinPdfPath);
  }

  const single = bulletin.pdf?.trim();
  return single ? [normalizeBulletinPdfPath(single)] : [];
}

export function getBulletinPdfFileName(pdfPath: string): string {
  const normalizedPath = normalizeBulletinPdfPath(pdfPath);
  return normalizedPath.split('/').pop() || normalizedPath;
}

export function getFormattedBulletinDate(bulletin: Bulletin) {
  try {
    return format(parse(bulletin.date, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy');
  } catch {
    return 'N/A';
  }
}

export function useFormattedBulletinDate(bulletin: Bulletin) {
  return useMemo(() => getFormattedBulletinDate(bulletin), [bulletin]);
}

export function getFormattedBulletinTitle(bulletin: Bulletin) {
  return `${getFormattedBulletinDate(bulletin)}${bulletin.name ? ` - ${bulletin.name}` : ''}`;
}

export function useFormattedBulletinTitle(bulletin: Bulletin) {
  return useMemo(() => getFormattedBulletinTitle(bulletin), [bulletin]);
}

export function useFormattedBulletinUrlDate(bulletin: Bulletin) {
  return useMemo(() => bulletin.date, [bulletin.date]);
}
