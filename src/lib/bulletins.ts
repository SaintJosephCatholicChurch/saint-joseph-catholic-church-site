import { parseISO } from 'date-fns';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import {
  getBulletinPdfPaths,
  getFormattedBulletinTitle,
  normalizeBulletinPdfPath
} from '../components/pages/custom/bulletins/util';
import { isNullish } from '../util/null.util';

import type { Bulletin, BulletinPDFData, BulletinPDFMeta } from '../interface';

export { getBulletinPdfPaths, normalizeBulletinPdfPath };

const pagesDirectory = join(process.cwd(), 'content/bulletins');
const DATE_WITH_OPTIONAL_DUPLICATE_SUFFIX = /^(\d{4}-\d{2}-\d{2})(?:-\d+)?$/i;

let bulletinCache: Bulletin[];
let metaCache: BulletinPDFData[];

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

function normalizeBulletinRecord(bulletin: Bulletin): Bulletin {
  const pdfPaths = getBulletinPdfPaths(bulletin);
  if (pdfPaths.length === 0) {
    return bulletin;
  }

  return {
    ...bulletin,
    pdf: pdfPaths[0],
    ...(bulletin.pdfs?.length ? { pdfs: pdfPaths } : {})
  };
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
      return normalizeBulletinRecord(bulletin);
    });

  return bulletinCache;
}

function readBulletinPdfMeta(pdfPath: string): BulletinPDFMeta {
  const metaFullPath = join(
    'public',
    normalizeBulletinPdfPath(pdfPath)
      .replace(/^\/+/, '')
      .replace(/\.pdf$/g, ''),
    'meta.json'
  );

  return JSON.parse(readFileSync(metaFullPath, 'utf8')) as BulletinPDFMeta;
}

export function fetchBulletinMetaData(bulletin: Bulletin | undefined): BulletinPDFData | undefined {
  const pdfPaths = getBulletinPdfPaths(bulletin);
  if (isNullish(bulletin) || pdfPaths.length === 0) {
    return undefined;
  }

  const pages: string[] = [];
  const texts: string[] = [];

  for (const pdfPath of pdfPaths) {
    const meta = readBulletinPdfMeta(pdfPath);
    pages.push(...(meta.pages ?? []));
    if (meta.text) {
      texts.push(meta.text);
    }
  }

  return {
    title: getFormattedBulletinTitle(bulletin),
    slug: bulletin.date,
    date: bulletin.date,
    pages,
    text: texts.join(' ')
  };
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
