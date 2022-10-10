import type { GetStaticProps } from 'next/types';
import PageLayout from '../../components/PageLayout';
import ParishBulletinsView from '../../components/pages/custom/bulletins/ParishBulletinsView';
import type { Bulletin, BulletinPDFData } from '../../interface';
import { fetchBulletins, fetchBulletinMetaData } from '../../lib/bulletins';
import { isNotNullish } from '../../util/null.util';

interface ParishBulletinsProps {
  bulletin?: Bulletin;
  bulletins: Bulletin[];
  meta?: BulletinPDFData;
}

const ParishBulletin = ({ bulletin, bulletins, meta }: ParishBulletinsProps) => {
  return (
    <PageLayout url="/parish-bulletins" title="Parish Bulletins" hideSidebar>
      {isNotNullish(bulletin) && isNotNullish(meta) ? (
        <ParishBulletinsView bulletins={bulletins} bulletin={bulletin} meta={meta} />
      ) : (
        <p>Bulletin not found</p>
      )}
    </PageLayout>
  );
};

export default ParishBulletin;

export const getStaticProps: GetStaticProps = async (): Promise<{ props: ParishBulletinsProps }> => {
  let bulletin: Bulletin | undefined;

  const bulletins = fetchBulletins();
  if (bulletins.length > 0) {
    bulletin = bulletins[0];
  }

  return {
    props: {
      bulletin,
      bulletins,
      meta: fetchBulletinMetaData(bulletin)
    }
  };
};
