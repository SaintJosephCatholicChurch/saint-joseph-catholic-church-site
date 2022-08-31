import { serialize } from 'next-mdx-remote/serialize';
import { GetStaticPaths, GetStaticProps } from 'next/types';
import PageLayout from '../../../components/PageLayout';
import PostList from '../../../components/posts/PostList';
import { SerializedPostContent, TagContent } from '../../../interface';
import config from '../../../lib/config';
import { countPosts, listPostContent } from '../../../lib/posts';
import { listTags } from '../../../lib/tags';

interface PostPageProps {
  posts: SerializedPostContent[];
  tags: TagContent[];
  page: number;
  pagination: {
    current: number;
    pages: number;
  };
}

const PostPage = ({ posts, tags, pagination, page }: PostPageProps) => {
  return (
    <PageLayout url={`/posts/page/${page}`} title="News">
      <PostList posts={posts} tags={tags} pagination={pagination} />
    </PageLayout>
  );
};

export default PostPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = Math.ceil(countPosts() / config.posts_per_page);
  const paths = Array.from(Array(pages - 1).keys()).map((it) => ({
    params: { page: (it + 2).toString() }
  }));

  return {
    paths: paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }): Promise<{ props: PostPageProps }> => {
  const page = parseInt(params.page as string);
  const posts = listPostContent(page, config.posts_per_page);
  const tags = listTags();
  const pagination = {
    current: page,
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
      page,
      posts: serializedPostContent,
      tags,
      pagination
    }
  };
};
