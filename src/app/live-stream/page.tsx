import { LiveStreamPageView } from '../client-pages/PublicPageViews';
import { buildPageMetadata } from '../routeMetadata';
import { getSidebarProps } from '../../lib/sidebar';

export const metadata = buildPageMetadata({
  url: '/live-stream',
  title: 'Live Stream'
});

export default function LiveStreamPage() {
  return <LiveStreamPageView {...getSidebarProps()} />;
}
