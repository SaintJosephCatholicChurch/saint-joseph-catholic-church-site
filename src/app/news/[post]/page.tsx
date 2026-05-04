import { parseISO } from 'date-fns';
import { notFound } from 'next/navigation';

import PageStructuredData from '../../PageStructuredData';
import { NewsPostPageView } from '../../client-pages/NewsPageViews';
import { buildPageMetadata } from '../../routeMetadata';
import { getNewsPostProps, getNewsPostStaticParams } from '../../routeData';

import type { Metadata } from 'next';

interface NewsPostRouteProps {
  params: Promise<{
    post: string;
  }>;
}

export const dynamicParams = false;

export const generateStaticParams = getNewsPostStaticParams;

export async function generateMetadata({ params }: NewsPostRouteProps): Promise<Metadata> {
  const { post } = await params;
  const postProps = getNewsPostProps(post);

  if (!postProps) {
    return buildPageMetadata({ url: `/news/${post}`, title: 'News' });
  }

  return buildPageMetadata({
    url: `/news/${postProps.slug}`,
    title: postProps.title,
    image: postProps.image,
    keywords: postProps.tags,
    type: 'article'
  });
}

export default async function NewsPostPage({ params }: NewsPostRouteProps) {
  const { post } = await params;
  const postProps = getNewsPostProps(post);

  if (!postProps) {
    notFound();
  }

  return (
    <>
      <PageStructuredData
        url={`/news/${postProps.slug}`}
        title={postProps.title}
        date={parseISO(postProps.dateString)}
        keywords={postProps.tags}
        image={postProps.image}
        description={postProps.description}
      />
      <NewsPostPageView {...postProps} />
    </>
  );
}
