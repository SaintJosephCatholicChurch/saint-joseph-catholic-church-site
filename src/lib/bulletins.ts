import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { readFileSync } from 'fs';
import { join } from 'path';
import data from '../../content/bulletins.json';
import { getFormattedBulletinTitle } from '../components/pages/custom/bulletins/util';
import { Bulletin, BulletinPDFData } from '../interface';
import { isNullish } from '../util/null.util';

export default data.bulletins as Bulletin[];

let metaCache: BulletinPDFData[];

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

  metaCache = data.bulletins.map(fetchBulletinMetaData);

  return metaCache;
}
