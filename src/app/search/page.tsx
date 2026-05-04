import { SearchPageView } from '../client-pages/PublicPageViews';
import { buildPageMetadata } from '../routeMetadata';
import { getSearchPageProps } from '../routeData';

export const metadata = buildPageMetadata({
  url: '/search',
  title: 'Search'
});

export default function SearchPage() {
  return <SearchPageView {...getSearchPageProps()} />;
}
