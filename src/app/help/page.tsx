import { HelpPageView } from '../client-pages/PublicPageViews';
import { buildPageMetadata } from '../routeMetadata';

export const metadata = buildPageMetadata({
  url: '/help',
  title: 'Help'
});

export default function HelpPage() {
  return <HelpPageView />;
}
