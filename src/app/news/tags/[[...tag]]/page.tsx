import { notFound } from 'next/navigation';

import { NewsTagPageView } from '../../../client-pages/NewsPageViews';
import { buildPageMetadata } from '../../../routeMetadata';
import { getNewsTagProps, getNewsTagStaticParams } from '../../../routeData';

import type { Metadata } from 'next';

interface NewsTagRouteProps {
  params: Promise<{
    tag?: string[];
  }>;
}

export const dynamicParams = false;

export const generateStaticParams = getNewsTagStaticParams;

export async function generateMetadata({ params }: NewsTagRouteProps): Promise<Metadata> {
  const { tag } = await params;
  const tagProps = getNewsTagProps(tag);

  if (!tagProps) {
    return buildPageMetadata({ url: '/news/tags', title: 'News' });
  }

  return buildPageMetadata({
    url: `/news/tags/${tagProps.tag}${tagProps.page ? `/${tagProps.page}` : ''}`,
    title: `#${tagProps.tag}`
  });
}

export default async function NewsTagPage({ params }: NewsTagRouteProps) {
  const { tag } = await params;
  const tagProps = getNewsTagProps(tag);

  if (!tagProps) {
    notFound();
  }

  return <NewsTagPageView {...tagProps} />;
}
