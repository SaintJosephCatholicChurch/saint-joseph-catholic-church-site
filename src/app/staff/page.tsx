import { StaffPageView } from '../client-pages/PublicPageViews';
import { buildPageMetadata } from '../routeMetadata';
import { getSidebarProps } from '../../lib/sidebar';

export const metadata = buildPageMetadata({
  url: '/staff',
  title: 'Parish Staff'
});

export default function StaffPage() {
  return <StaffPageView {...getSidebarProps()} />;
}
