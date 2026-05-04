import { ParishRegistrationPageView } from '../client-pages/PublicPageViews';
import { buildPageMetadata } from '../routeMetadata';
import { getSidebarProps } from '../../lib/sidebar';

export const metadata = buildPageMetadata({
  url: '/test-parish-registration',
  title: 'Parish Membership'
});

export default function ParishRegistrationPage() {
  return <ParishRegistrationPageView {...getSidebarProps()} />;
}
