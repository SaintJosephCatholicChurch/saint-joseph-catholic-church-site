import PageLayout from '../../../../components/PageLayout';
import TagPostList from '../../../../components/pages/news/TagPostList';
import config from '../../../../lib/config';
import { listPostContent } from '../../../../lib/posts';
import { listTags } from '../../../../lib/tags';
import { generateBasicMeta } from '../../../../meta/BasicMeta';
import { generateOpenGraphMeta } from '../../../../meta/OpenGraphMeta';
import { generateTwitterCardMeta } from '../../../../meta/TwitterCardMeta';

import type { Metadata } from 'next/types';
import type { PageProps } from '../../../../interface';

export function generateMetadata({ params }: PageProps): Metadata {
  const tag = params.tag as string;

  const url = `/news/tags/${tag}`;
  const title = `#${tag}`;

  return {
    ...generateBasicMeta({ url, title }),
    ...generateOpenGraphMeta({ url, title }),
    ...generateTwitterCardMeta({ url, title })
  };
}

export const generateStaticParams = (): Record<string, unknown>[] => {
  const tags = listTags();
  return tags.map((tag) => ({ tag }));
};

const TagsIndex = async ({ params }: PageProps) => {
  const tag = params.tag as string;
  const posts = await listPostContent(tag);

  return (
    <PageLayout url={`/news/tags/${tag}`} title={`#${tag}`} hideHeader>
      <TagPostList tag={tag} posts={posts} postsPerPage={config.posts_per_page} />
    </PageLayout>
  );
};

export default TagsIndex;
