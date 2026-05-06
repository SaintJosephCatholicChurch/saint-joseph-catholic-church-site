'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import AppPageShell from '../AppPageShell';
import SearchBox from '../../components/SearchBox';
import PageContentView from '../../components/pages/PageContentView';
import { REDIRECTS } from '../../constants';

import type { SidebarProps } from '../../lib/sidebar';

export const AdminPageView = () => {
  const AdminShellNoSSR = useMemo(
    () =>
      dynamic(() => import('../../admin/AdminShell'), {
        ssr: false
      }),
    []
  );

  return <AdminShellNoSSR key="admin" />;
};

export const NotFoundPageView = ({ ...sidebarProps }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && pathname in REDIRECTS) {
      router.replace(REDIRECTS[pathname as keyof typeof REDIRECTS]);
    }
  }, [pathname, router]);

  return (
    <AppPageShell
      title="Page not found"
      recentPosts={sidebarProps.recentPosts}
      dailyReadings={sidebarProps.dailyReadings}
    >
      <PageContentView>
        <p>Sorry, the page you are looking for was either not found or does not exist.</p>
        <p>Try searching below or return to the home page.</p>
      </PageContentView>
      <SearchBox value="" disableMargin />
    </AppPageShell>
  );
};
