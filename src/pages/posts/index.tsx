import { GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import PageLayout from '../../components/PageLayout';
import PostList from '../../components/PostList';
import { SerializedPostContent } from '../../interface';
import config from '../../lib/config';
import { countPosts, listPostContent } from '../../lib/posts';
import { listTags, TagContent } from '../../lib/tags';

type Props = {
  posts: SerializedPostContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Index({ posts, tags, pagination }: Props) {
  return (
    <PageLayout url="/posts" title="News">
      <PostList posts={posts} tags={tags} pagination={pagination} />
    </PageLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = listPostContent(1, config.posts_per_page);
  const tags = listTags();
  const pagination = {
    current: 1,
    pages: Math.ceil(countPosts() / config.posts_per_page)
  };

  const serializedPostContent: SerializedPostContent[] = [];
  for (const { summary, data, fullPath } of posts) {
    serializedPostContent.push({
      fullPath,
      data,
      source: await serialize(summary, { scope: data as Record<string, any> })
    });
  }

  return {
    props: {
      posts: serializedPostContent,
      tags,
      pagination
    }
  };
};
