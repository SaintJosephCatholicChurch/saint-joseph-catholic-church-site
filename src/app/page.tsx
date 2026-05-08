import config from '../lib/config';
import { getSidebarProps } from '../lib/sidebar';
import HomepagePage from './HomepagePage';

import type { Metadata } from 'next';

const baseUrl = config.base_url.replace(/\/$/g, '');
const siteImageUrl = `${baseUrl}/${config.site_image.replace(/^\//g, '')}`;

export const metadata: Metadata = {
  title: config.site_title,
  description: config.site_description,
  keywords: config.site_keywords,
  alternates: {
    canonical: `${baseUrl}/`
  },
  openGraph: {
    siteName: config.site_title,
    url: `${baseUrl}/`,
    title: config.site_title,
    description: config.site_description,
    images: [siteImageUrl],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: config.site_title,
    description: config.site_description,
    images: [siteImageUrl]
  }
};

export default function Page() {
  const sidebarProps = getSidebarProps();

  return <HomepagePage {...sidebarProps} />;
}
