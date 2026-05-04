import { parseISO } from 'date-fns';
import { notFound } from 'next/navigation';

import PageStructuredData from '../PageStructuredData';
import { ContentPageView } from '../client-pages/PublicPageViews';
import { buildPageMetadata } from '../routeMetadata';
import { getContentPageProps, getContentPageStaticParams } from '../routeData';

import type { Metadata } from 'next';

interface ContentPageRouteProps {
  params: Promise<{
    page: string;
  }>;
}

export const dynamicParams = false;

export const generateStaticParams = getContentPageStaticParams;

export async function generateMetadata({ params }: ContentPageRouteProps): Promise<Metadata> {
  const { page } = await params;
  const pageProps = getContentPageProps(page);

  if (!pageProps) {
    return buildPageMetadata({ url: `/${page}` });
  }

  return buildPageMetadata({
    url: `/${pageProps.slug}`,
    title: pageProps.title,
    image: pageProps.image,
    keywords: pageProps.tags
  });
}

export default async function ContentPage({ params }: ContentPageRouteProps) {
  const { page } = await params;
  const pageProps = getContentPageProps(page);

  if (!pageProps) {
    notFound();
  }

  return (
    <>
      <PageStructuredData
        url={`/${pageProps.slug}`}
        title={pageProps.title}
        date={parseISO(pageProps.dateString)}
        keywords={pageProps.tags}
        image={pageProps.image}
        description={pageProps.description}
      />
      <ContentPageView {...pageProps} />
    </>
  );
}
