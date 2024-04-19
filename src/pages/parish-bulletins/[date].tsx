import { format, parseISO } from 'date-fns';

import PageLayout from '../../components/PageLayout';
import ParishBulletinsView from '../../components/pages/custom/bulletins/ParishBulletinsView';
import { fetchBulletinMetaData, fetchBulletins } from '../../lib/bulletins';
import { isNotNullish } from '../../util/null.util';

import type { GetStaticPaths, GetStaticProps } from 'next/types';
import type { Bulletin, BulletinPDFData } from '../../interface';

interface ParishBulletinsProps {
  bulletin?: Bulletin;
  bulletins: Bulletin[];
  meta?: BulletinPDFData;
}

const ParishBulletin = ({ bulletin, bulletins, meta }: ParishBulletinsProps) => {
  return (
    <PageLayout url={`/parish-bulletins/${bulletin.date}`} title="Parish Bulletins" hideSidebar hideHeader>
      {isNotNullish(bulletin) && isNotNullish(meta) ? (
        <ParishBulletinsView bulletins={bulletins} bulletin={bulletin} meta={meta} />
      ) : (
        <p>Bulletin not found</p>
      )}
    </PageLayout>
  );
};

export default ParishBulletin;

export const getStaticPaths: GetStaticPaths = () => {
  const paths = fetchBulletins().map(
    (bulletin) => `/parish-bulletins/${format(parseISO(bulletin.date), 'yyyy-MM-dd')}`
  );
  return {
    paths,
    fallback: false
  };
};

const buildDateToBulletin = () => {
  const hash: Record<string, Bulletin> = {};
  fetchBulletins().forEach((bulletin) => {
    if (!(bulletin.date in hash)) {
      hash[format(parseISO(bulletin.date), 'yyyy-MM-dd')] = bulletin;
    }
  });
  return hash;
};

let dateToBulletin = buildDateToBulletin();

export const getStaticProps: GetStaticProps = ({ params }): { props: ParishBulletinsProps } => {
  const date = params.date as string;

  if (process.env.NODE_ENV === 'development') {
    dateToBulletin = buildDateToBulletin();
  }

  const bulletin = dateToBulletin[date];

  return {
    props: {
      bulletin,
      bulletins: fetchBulletins(),
      meta: fetchBulletinMetaData(bulletin)
    }
  };
};
