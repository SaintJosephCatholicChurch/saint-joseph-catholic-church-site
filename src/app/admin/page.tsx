import { AdminPageView } from '../client-pages/SpecialPageViews';
import { buildPageMetadata } from '../routeMetadata';

export const metadata = buildPageMetadata({
  url: '/admin',
  title: 'Admin'
});

export default function AdminPage() {
  return <AdminPageView />;
}
