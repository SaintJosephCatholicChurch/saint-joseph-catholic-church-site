import { AdminPageView } from '../client-pages/SpecialPageViews';
import { buildPageMetadata } from '../routeMetadata';

export const metadata = {
  ...buildPageMetadata({
    url: '/admin',
    title: 'Admin'
  }),
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  return <AdminPageView />;
}
