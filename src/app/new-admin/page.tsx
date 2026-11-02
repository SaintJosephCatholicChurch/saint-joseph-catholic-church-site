import { NewAdminPageView } from '../client-pages/SpecialPageViews';
import { buildPageMetadata } from '../routeMetadata';

export const metadata = {
  ...buildPageMetadata({
    url: '/new-admin',
    title: 'New Admin'
  }),
  robots: { index: false, follow: false }
};

export default function NewAdminPage() {
  return <NewAdminPageView />;
}
