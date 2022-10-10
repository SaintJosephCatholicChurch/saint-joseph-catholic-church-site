import { parse } from 'date-fns';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { getFormattedBulletinTitle } from '../components/pages/custom/bulletins/util';
import { Bulletin, BulletinPDFData } from '../interface';
import { isNullish } from '../util/null.util';

const pagesDirectory = join(process.cwd(), 'content/bulletins');

let bulletinCache: BulletinPDFData[];
let metaCache: BulletinPDFData[];

export function fetchBulletins(): Bulletin[] {
  if (metaCache && process.env.NODE_ENV !== 'development') {
    return metaCache;
  }

  const fileNames = readdirSync(pagesDirectory).filter((it) => it.endsWith('.json'));
  fileNames.sort((a, b) => parseISO(b.replace('.json', '').toUpperCase()).getTime() - parseISO(a.replace('.json', '').toUpperCase()).getTime());

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
    slug: format(parseISO(bulletin.date), 'yyyy-MM-dd'),
    date: bulletin.date,
    ...JSON.parse(readFileSync(metaFullPath, 'utf8'))
  };
}

export function fetchBulletinsMetaData(): BulletinPDFData[] {
  if (metaCache && process.env.NODE_ENV !== 'development') {
    return metaCache;
  }

  metaCache = fetchBulletins().map(fetchBulletinMetaData);

  return metaCache;
}
