import { notFound } from 'next/navigation';

import { NewsPaginationPageView } from '../../../client-pages/NewsPageViews';
import { buildPageMetadata } from '../../../routeMetadata';
import { getNewsPageProps, getNewsPageStaticParams } from '../../../routeData';

import type { Metadata } from 'next';

interface NewsPaginationRouteProps {
  params: Promise<{
    page: string;
  }>;
}

export const dynamicParams = false;

export const generateStaticParams = getNewsPageStaticParams;

export async function generateMetadata({ params }: NewsPaginationRouteProps): Promise<Metadata> {
  const { page } = await params;
  return buildPageMetadata({
    url: `/news/page/${page}`,
    title: 'News'
  });
}

export default async function NewsPaginationPage({ params }: NewsPaginationRouteProps) {
  const { page } = await params;
  const pageProps = getNewsPageProps(page);

  if (!pageProps) {
    notFound();
  }

  return <NewsPaginationPageView {...pageProps} />;
}
