import { parseISO } from 'date-fns';

import PageLayout from '../../../components/PageLayout';
import PostView from '../../../components/posts/PostView';
import { fetchPostContent } from '../../../lib/posts';
import { getSidebarProps } from '../../../lib/sidebar';
import { generateBasicMeta } from '../../../meta/BasicMeta';
import { generateOpenGraphMeta } from '../../../meta/OpenGraphMeta';
import { generateTwitterCardMeta } from '../../../meta/TwitterCardMeta';

import type { Metadata } from 'next';
import type { PageProps, PostContent } from '../../../interface';
import type { SidebarProps } from '../../../lib/sidebar';

interface PostProps extends SidebarProps {
  title: string;
  image?: string;
  dateString: string;
  slug: string;
  tags: string[];
  description?: string;
  content: string;
}

export function generateMetadata({ title, image, slug, description = '' }: PostProps): Metadata {
  const url = `/pages/${slug}`;

  return {
    ...generateBasicMeta({ url, title, description }),
    ...generateOpenGraphMeta({ url, title, description, image }),
    ...generateTwitterCardMeta({ url, title, description, image })
  };
}

const buildSlugToPostContent = (postContents: PostContent[]) => {
  const hash: Record<string, PostContent> = {};
  postContents.forEach((post) => (hash[post.data.slug] = post));
  return hash;
};

let slugToPostContent: Record<string, PostContent> = null;

export const generateStaticParams = async (): Promise<Record<string, unknown>[]> => {
  const pages = await fetchPostContent();
  return pages.map((post) => ({ post: post.data.slug }));
};

const Post = async ({ params }: PageProps) => {
  const slug = params.post as string;

  if (process.env.NODE_ENV === 'development' || slugToPostContent == null) {
    slugToPostContent = buildSlugToPostContent(await fetchPostContent());
  }

  const { content, data } = slugToPostContent[slug];

  const title = data.title;
  const image = data.image ?? '';
  const date = parseISO(data.date);
  const tags = data.tags ?? [];

  const sidebarProps = await getSidebarProps();

  return (
    <PageLayout
      url={`/pages/${slug}`}
      title={title}
      pageDetails={{ date, image }}
      tags={tags}
      description=""
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
