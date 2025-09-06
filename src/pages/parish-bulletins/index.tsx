import { format, parseISO } from 'date-fns';

import { fetchBulletins } from '../../lib/bulletins';

import type { GetStaticProps } from 'next/types';
import type { Bulletin } from '../../interface';

const ParishBulletin = () => {};

export default ParishBulletin;

export const getStaticProps: GetStaticProps = () => {
  let bulletin: Bulletin | undefined;

  const bulletins = fetchBulletins();
  if (bulletins.length > 0) {
    bulletin = bulletins[0];
  }

  return {
    redirect: {
      destination: `/parish-bulletins/${format(parseISO(bulletin.date), 'yyyy-MM-dd')}`,
      permanent: true
    }
  };
};
