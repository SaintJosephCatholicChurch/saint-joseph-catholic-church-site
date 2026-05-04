import { NotFoundPageView } from './client-pages/SpecialPageViews';
import { getSidebarProps } from '../lib/sidebar';

export default function NotFound() {
  return <NotFoundPageView {...getSidebarProps()} />;
}
