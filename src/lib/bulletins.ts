import { parseISO } from 'date-fns';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { getFormattedBulletinTitle } from '../components/pages/custom/bulletins/util';
import { isNullish } from '../util/null.util';

import type { Bulletin, BulletinPDFData } from '../interface';

const pagesDirectory = join(process.cwd(), 'content/bulletins');

let bulletinCache: BulletinPDFData[];
let metaCache: BulletinPDFData[];

export async function fetchBulletins(): Promise<Bulletin[]> {
  if (bulletinCache && process.env.NODE_ENV !== 'development') {
    return bulletinCache;
  }

  const fileNames = (await readdir(pagesDirectory)).filter((it) => it.endsWith('.json'));
  fileNames.sort(
    (a, b) =>
      parseISO(b.replace('.json', '').toUpperCase()).getTime() -
      parseISO(a.replace('.json', '').toUpperCase()).getTime()
  );

  const jsonFileNames = fileNames.filter((it) => it.endsWith('.json'));

  bulletinCache = [];

  for (const fileName of jsonFileNames) {
    bulletinCache.push(JSON.parse(await readFile(join(pagesDirectory, fileName), 'utf8')) as BulletinPDFData);
  }

  return bulletinCache;
}

export async function fetchBulletinMetaData(bulletin: Bulletin | undefined): Promise<BulletinPDFData | undefined> {
  if (isNullish(bulletin)) {
    return undefined;
  }

  const metaFullPath = join('public', bulletin.pdf.replace(/\.pdf$/g, ''), 'meta.json');
  return {
    title: getFormattedBulletinTitle(bulletin),
    slug: bulletin.date,
    date: bulletin.date,
    ...JSON.parse(await readFile(metaFullPath, 'utf8'))
  } as BulletinPDFData;
}

export async function fetchBulletinsMetaData(): Promise<BulletinPDFData[]> {
  if (metaCache && process.env.NODE_ENV !== 'development') {
    return metaCache;
  }

  metaCache = [];

  const bulletins = await fetchBulletins();
  for (const bulletin of bulletins) {
    metaCache.push(await fetchBulletinMetaData(bulletin));
  }

  return metaCache;
}
