import { useRouter } from 'next/router';
import { useEffect } from 'react';

import PageLayout from '../components/PageLayout';
import PageContentView from '../components/pages/PageContentView';
import SearchBox from '../components/SearchBox';
import { REDIRECTS } from '../constants';
import { getSidebarProps } from '../lib/sidebar';

import type { GetStaticProps } from 'next/types';
import type { SidebarProps } from '../lib/sidebar';

const NotFoundPage = ({ ...sidebarProps }: SidebarProps) => {
  const router = useRouter();

  useEffect(() => {
    if (router.asPath in REDIRECTS) {
      router.push(REDIRECTS[router.asPath as keyof typeof REDIRECTS]);
    }
  }, [router, router.asPath]);

  return (
    <PageLayout url={`/404`} title="Page not found" {...sidebarProps}>
      <PageContentView>
        <p>Sorry, the page you are looking for was either not found or does not exist.</p>
        <p>Try searching below or return to the home page.</p>
      </PageContentView>
      <SearchBox value="" disableMargin />
    </PageLayout>
  );
};

export default NotFoundPage;

export const getStaticProps: GetStaticProps = async (): Promise<{ props: SidebarProps }> => {
  return {
    props: {
      ...getSidebarProps()
    }
  };
};
