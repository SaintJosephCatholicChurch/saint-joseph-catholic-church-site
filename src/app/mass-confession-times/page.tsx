import { MassConfessionTimesPageView } from '../client-pages/PublicPageViews';
import { buildPageMetadata } from '../routeMetadata';
import { getSidebarProps } from '../../lib/sidebar';

export const metadata = buildPageMetadata({
  url: '/mass-confession-times',
  title: 'Mass & Confession Times'
});

export default function MassConfessionTimesPage() {
  return <MassConfessionTimesPageView {...getSidebarProps()} />;
}
