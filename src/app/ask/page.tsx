import { AskPageView } from '../client-pages/PublicPageViews';
import { buildPageMetadata } from '../routeMetadata';
import { getSidebarProps } from '../../lib/sidebar';

export const metadata = buildPageMetadata({
  url: '/ask',
  title: 'Did You Know? Question Submission'
});

export default function AskPage() {
  return <AskPageView {...getSidebarProps()} />;
}
