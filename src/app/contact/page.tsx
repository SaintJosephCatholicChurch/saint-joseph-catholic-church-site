import { ContactPageView } from '../client-pages/PublicPageViews';
import { buildPageMetadata } from '../routeMetadata';

export const metadata = buildPageMetadata({
  url: '/contact',
  title: 'Contact'
});

export default function ContactPage() {
  return <ContactPageView />;
}
