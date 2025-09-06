import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { fetchBulletins } from '../../lib/bulletins';

import type { GetStaticProps } from 'next/types';
import type { Bulletin } from '../../interface';

interface ParishBulletinsProps {
  bulletin?: Bulletin;
}

const ParishBulletin = ({ bulletin }: ParishBulletinsProps) => {
  const router = useRouter();

  useEffect(() => {
    router.push(`/parish-bulletins/${format(parseISO(bulletin.date), 'yyyy-MM-dd')}`);
  });
};

export default ParishBulletin;

export const getStaticProps: GetStaticProps = (): { props: ParishBulletinsProps } => {
  let bulletin: Bulletin | undefined;

  const bulletins = fetchBulletins();
  if (bulletins.length > 0) {
    bulletin = bulletins[0];
  }

  return {
    props: {
      bulletin
    }
  };
};
