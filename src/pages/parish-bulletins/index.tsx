import fs from 'fs';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import { join } from 'path';
import PageLayout from '../../components/PageLayout';
import ParishBulletinsView from '../../components/pages/custom/ParishBulletinsView';
import type { Bulletin, BulletinPDFMeta } from '../../interface';
import bulletins from '../../lib/bulletins';
import { isNotNullish } from '../../util/null.util';

interface ParishBulletinsProps {
  bulletin?: Bulletin;
  meta?: BulletinPDFMeta;
}

const ParishBulletin = ({ bulletin, meta }: ParishBulletinsProps) => {
  return (
    <PageLayout url="/parish-bulletins" title="Parish Bulletins" showSidebar={false}>
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
  let meta: BulletinPDFMeta | undefined;

  if (bulletins.length > 0) {
    bulletin = bulletins[0];
    if (isNotNullish(bulletin)) {
      const metaFullPath = join('public', bulletin.pdf.replace(/\.pdf$/g, ''), 'meta.json');
      meta = JSON.parse(fs.readFileSync(metaFullPath, 'utf8'));
    }
  }

  return {
    props: {
      bulletin,
      meta
    }
  };
};
