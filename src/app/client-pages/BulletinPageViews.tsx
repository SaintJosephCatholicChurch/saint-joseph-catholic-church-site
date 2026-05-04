'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import AppPageShell from '../AppPageShell';
import ParishBulletinsView from '../../components/pages/custom/bulletins/ParishBulletinsView';
import { isNotNullish } from '../../util/null.util';

import type { BulletinRouteProps } from '../routeData';

interface BulletinIndexRedirectPageViewProps {
  redirectUrl: string;
}

export const BulletinPageView = ({ bulletin, bulletins, meta }: BulletinRouteProps) => {
  return (
    <AppPageShell title="Parish Bulletins" hideSidebar hideHeader>
      {isNotNullish(bulletin) && isNotNullish(meta) ? (
        <ParishBulletinsView bulletins={bulletins} bulletin={bulletin} meta={meta} />
      ) : (
        <p>Bulletin not found</p>
      )}
    </AppPageShell>
  );
};

export const BulletinIndexRedirectPageView = ({ redirectUrl }: BulletinIndexRedirectPageViewProps): null => {
  const router = useRouter();

  useEffect(() => {
    router.replace(redirectUrl);
  }, [redirectUrl, router]);

  return null;
};
