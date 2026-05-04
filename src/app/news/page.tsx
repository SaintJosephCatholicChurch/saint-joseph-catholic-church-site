import { NewsIndexPageView } from '../client-pages/NewsPageViews';
import { buildPageMetadata } from '../routeMetadata';
import { getNewsIndexProps } from '../routeData';

export const metadata = buildPageMetadata({
  url: '/news',
  title: 'News'
});

export default function NewsPage() {
  return <NewsIndexPageView {...getNewsIndexProps()} />;
}
