import { parseISO } from 'date-fns';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { getFormattedBulletinTitle } from '../components/pages/custom/bulletins/util';
import { isNullish } from '../util/null.util';

import type { Bulletin, BulletinPDFData } from '../interface';

const pagesDirectory = join(process.cwd(), 'content/bulletins');
const DATE_WITH_OPTIONAL_DUPLICATE_SUFFIX = /^(\d{4}-\d{2}-\d{2})(?:-\d+)?$/i;

let bulletinCache: Bulletin[];
let metaCache: BulletinPDFData[];

export function normalizeBulletinPdfPath(pdfPath: string): string {
  const publicRelativePath = pdfPath
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/^(?:public\/)+/, '');
  return `/${publicRelativePath}`;
}

export function getBulletinFileNameSortTime(fileName: string): number {
  const baseName = fileName.replace(/\.json$/i, '');
  const dateMatch = DATE_WITH_OPTIONAL_DUPLICATE_SUFFIX.exec(baseName);
  const sortName = dateMatch ? dateMatch[1] : baseName;
  const time = parseISO(sortName.toUpperCase()).getTime();
  return Number.isFinite(time) ? time : Number.NEGATIVE_INFINITY;
}

export function compareBulletinFileNames(leftFileName: string, rightFileName: string): number {
  const timeDiff = getBulletinFileNameSortTime(rightFileName) - getBulletinFileNameSortTime(leftFileName);
  if (timeDiff !== 0) {
    return timeDiff;
  }

  return rightFileName.localeCompare(leftFileName);
}

export function fetchBulletins(): Bulletin[] {
  if (bulletinCache && process.env.NODE_ENV !== 'development') {
    return bulletinCache;
  }

  const fileNames = readdirSync(pagesDirectory).filter((it) => it.endsWith('.json'));
  fileNames.sort(compareBulletinFileNames);

  bulletinCache = fileNames
    .filter((it) => it.endsWith('.json'))
    .map((fileName) => {
      const bulletin = JSON.parse(readFileSync(join(pagesDirectory, fileName), 'utf8')) as Bulletin;
      return bulletin.pdf ? { ...bulletin, pdf: normalizeBulletinPdfPath(bulletin.pdf) } : bulletin;
    });

  return bulletinCache;
}

export function fetchBulletinMetaData(bulletin: Bulletin | undefined): BulletinPDFData | undefined {
  if (isNullish(bulletin?.pdf)) {
    return undefined;
  }

  const metaFullPath = join(
    'public',
    normalizeBulletinPdfPath(bulletin.pdf)
      .replace(/^\/+/, '')
      .replace(/\.pdf$/g, ''),
    'meta.json'
  );
  return {
    title: getFormattedBulletinTitle(bulletin),
    slug: bulletin.date,
    date: bulletin.date,
    ...JSON.parse(readFileSync(metaFullPath, 'utf8'))
  } as BulletinPDFData;
}

export function fetchBulletinsMetaData(): BulletinPDFData[] {
  if (metaCache && process.env.NODE_ENV !== 'development') {
    return metaCache;
  }

  metaCache = fetchBulletins()
    .map(fetchBulletinMetaData)
    .filter((it): it is BulletinPDFData => !isNullish(it));

  return metaCache;
}
