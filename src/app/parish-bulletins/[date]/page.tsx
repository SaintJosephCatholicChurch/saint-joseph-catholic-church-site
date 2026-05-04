import { notFound } from 'next/navigation';

import { BulletinPageView } from '../../client-pages/BulletinPageViews';
import { buildPageMetadata } from '../../routeMetadata';
import { getBulletinProps, getBulletinStaticParams } from '../../routeData';

import type { Metadata } from 'next';

interface BulletinRoutePageProps {
  params: Promise<{
    date: string;
  }>;
}

export const dynamicParams = false;

export const generateStaticParams = getBulletinStaticParams;

export async function generateMetadata({ params }: BulletinRoutePageProps): Promise<Metadata> {
  const { date } = await params;
  return buildPageMetadata({
    url: `/parish-bulletins/${date}`,
    title: 'Parish Bulletins'
  });
}

export default async function BulletinRoutePage({ params }: BulletinRoutePageProps) {
  const { date } = await params;
  const bulletinProps = getBulletinProps(date);

  if (!bulletinProps) {
    notFound();
  }

  return <BulletinPageView {...bulletinProps} />;
}
