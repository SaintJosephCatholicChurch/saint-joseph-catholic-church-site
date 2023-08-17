import parseISO from 'date-fns/parseISO';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { getFormattedBulletinTitle } from '../components/pages/custom/bulletins/util';
import { isNullish } from '../util/null.util';

import type { Bulletin, BulletinPDFData } from '../interface';

const pagesDirectory = join(process.cwd(), 'content/bulletins');

let bulletinCache: BulletinPDFData[];
let metaCache: BulletinPDFData[];

export function fetchBulletins(): Bulletin[] {
  if (bulletinCache && process.env.NODE_ENV !== 'development') {
    return bulletinCache;
  }

  const fileNames = readdirSync(pagesDirectory).filter((it) => it.endsWith('.json'));
  fileNames.sort(
    (a, b) =>
      parseISO(b.replace('.json', '').toUpperCase()).getTime() -
      parseISO(a.replace('.json', '').toUpperCase()).getTime()
  );

  bulletinCache = fileNames
    .filter((it) => it.endsWith('.json'))
    .map((fileName) => {
      return JSON.parse(readFileSync(join(pagesDirectory, fileName), 'utf8')) as BulletinPDFData;
    });

  return bulletinCache;
}

export function fetchBulletinMetaData(bulletin: Bulletin | undefined): BulletinPDFData | undefined {
  if (isNullish(bulletin)) {
    return undefined;
  }

  const metaFullPath = join('public', bulletin.pdf.replace(/\.pdf$/g, ''), 'meta.json');
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

  metaCache = fetchBulletins().map(fetchBulletinMetaData);

  return metaCache;
}
