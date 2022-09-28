import parseISO from 'date-fns/parseISO';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import { useMemo } from 'react';
import PageLayout from '../../components/PageLayout';
import PostView from '../../components/posts/PostView';
import type { PostContent } from '../../interface';
import { fetchPostContent } from '../../lib/posts';
import { getSidebarProps, SidebarProps } from '../../lib/sidebar';

interface PostProps extends SidebarProps {
  title: string;
  image?: string;
  dateString: string;
  slug: string;
  tags: string[];
  description?: string;
  content: string;
}

const Post = ({ title, image, dateString, slug, tags, description = '', content, ...sidebarProps }: PostProps) => {
  const date = useMemo(() => parseISO(dateString), [dateString]);

  return (
    <PageLayout
      url={`/pages/${slug}`}
      title={title}
      pageDetails={{ date, image }}
      tags={tags}
      description={description}
      hideHeader
      {...sidebarProps}
    >
      <PostView title={title} date={date} image={image} tags={tags}>
        <div
          dangerouslySetInnerHTML={{
            __html: content
          }}
        />
      </PostView>
    </PageLayout>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = fetchPostContent().map((post) => `/news/${post.data.slug}`);
  return {
    paths,
    fallback: false
  };
};

const buildSlugToPostContent = (postContents: PostContent[]) => {
  const hash: Record<string, PostContent> = {};
  postContents.forEach((post) => (hash[post.data.slug] = post));
  return hash;
};

let slugToPostContent = buildSlugToPostContent(fetchPostContent());

export const getStaticProps: GetStaticProps = async ({ params }): Promise<{ props: PostProps }> => {
  const slug = params.post as string;

  if (process.env.NODE_ENV === 'development') {
    slugToPostContent = buildSlugToPostContent(fetchPostContent());
  }

  const { content, data } = slugToPostContent[slug];

  return {
    props: {
      title: data.title,
      image: data.image ?? '',
      dateString: data.date,
      slug: data.slug,
      description: '',
      tags: data.tags ?? [],
      content,
      ...getSidebarProps()
    }
  };
};
