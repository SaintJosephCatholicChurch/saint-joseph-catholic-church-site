import { EventsPageView } from '../client-pages/PublicPageViews';
import { buildPageMetadata } from '../routeMetadata';

export const metadata = buildPageMetadata({
  url: '/events',
  title: 'Events'
});

export default function EventsPage() {
  return <EventsPageView />;
}
