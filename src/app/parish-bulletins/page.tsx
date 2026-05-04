import { notFound } from 'next/navigation';

import { BulletinIndexRedirectPageView } from '../client-pages/BulletinPageViews';
import { buildPageMetadata } from '../routeMetadata';
import { getBulletinRedirectPath } from '../routeData';

export const metadata = buildPageMetadata({
  url: '/parish-bulletins',
  title: 'Parish Bulletins'
});

export default function BulletinIndexPage() {
  const redirectUrl = getBulletinRedirectPath();

  if (!redirectUrl) {
    notFound();
  }

  return <BulletinIndexRedirectPageView redirectUrl={redirectUrl} />;
}
