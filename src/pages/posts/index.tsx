import type { GetStaticProps } from 'next/types';
import PageLayout from '../../components/PageLayout';
import PostList from '../../components/posts/PostList';
import type { PostContent, TagContent } from '../../interface';
import config from '../../lib/config';
import { countPosts, listPostContent } from '../../lib/posts';
import { listTags } from '../../lib/tags';

interface PostsIndexProps {
  posts: PostContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
}

const PostsIndex = ({ posts, tags, pagination }: PostsIndexProps) => {
  return (
    <PageLayout url="/posts" title="News" showHeader={false}>
      <PostList posts={posts} tags={tags} pagination={pagination} />
    </PageLayout>
  );
};

export default PostsIndex;

export const getStaticProps: GetStaticProps = async (): Promise<{ props: PostsIndexProps }> => {
  const posts = listPostContent(1, config.posts_per_page);
  const tags = listTags();
  const pagination = {
    current: 1,
    pages: Math.ceil(countPosts() / config.posts_per_page)
  };

  return {
    props: {
      posts,
      tags,
      pagination
    }
  };
};
