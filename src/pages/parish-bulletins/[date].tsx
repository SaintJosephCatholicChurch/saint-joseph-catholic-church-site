import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import fs from 'fs';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import { join } from 'path';
import PageLayout from '../../components/PageLayout';
import ParishBulletinsView from '../../components/pages/custom/bulletins/ParishBulletinsView';
import type { Bulletin, BulletinPDFMeta } from '../../interface';
import bulletins from '../../lib/bulletins';
import { isNotNullish } from '../../util/null.util';

interface ParishBulletinsProps {
  bulletin?: Bulletin;
  meta?: BulletinPDFMeta;
}

const ParishBulletin = ({ bulletin, meta }: ParishBulletinsProps) => {
  return (
    <PageLayout url={`/parish-bulletins/${bulletin.date}`} title="Parish Bulletins" hideSidebar>
      {isNotNullish(bulletin) && isNotNullish(meta) ? (
        <ParishBulletinsView bulletins={bulletins} bulletin={bulletin} meta={meta} />
      ) : (
        <p>Bulletin not found</p>
      )}
    </PageLayout>
  );
};

export default ParishBulletin;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = bulletins.map((bulletin) => `/parish-bulletins/${format(parseISO(bulletin.date), 'yyyy-MM-dd')}`);
  return {
    paths,
    fallback: false
  };
};

const buildDateToBulletin = () => {
  const hash: Record<string, Bulletin> = {};
  bulletins.forEach((bulletin) => {
    if (!(bulletin.date in hash)) {
      hash[format(parseISO(bulletin.date), 'yyyy-MM-dd')] = bulletin;
    }
  });
  return hash;
};

let dateToBulletin = buildDateToBulletin();

export const getStaticProps: GetStaticProps = async ({ params }): Promise<{ props: ParishBulletinsProps }> => {
  const date = params.date as string;

  if (process.env.NODE_ENV === 'development') {
    dateToBulletin = buildDateToBulletin();
  }

  const bulletin = dateToBulletin[date];
  let meta: BulletinPDFMeta | undefined;

  if (isNotNullish(bulletin)) {
    const metaFullPath = join('public', bulletin.pdf.replace(/\.pdf$/g, ''), 'meta.json');
    meta = JSON.parse(fs.readFileSync(metaFullPath, 'utf8'));
  }

  return {
    props: {
      bulletin,
      meta
    }
  };
};
