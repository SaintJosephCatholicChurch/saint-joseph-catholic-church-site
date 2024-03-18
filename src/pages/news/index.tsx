import PageLayout from '../../components/PageLayout';
import PostListWithFlockNote from '../../components/posts/PostListWithFlockNote';
import config from '../../lib/config';
import homepageData from '../../lib/homepage';
import { countPosts, fetchPostContent } from '../../lib/posts';

import type { GetStaticProps } from 'next/types';
import type { PostContent } from '../../interface';

interface PostsIndexProps {
  allPosts: PostContent[];
  pagination: {
    start: number;
    total: number;
    current: number;
    pages: number;
  };
}

const PostsIndex = ({ allPosts, pagination }: PostsIndexProps) => {
  return (
    <PageLayout url="/news" title="News" dailyReadings={homepageData.daily_readings} hideHeader>
      <PostListWithFlockNote allPosts={allPosts} pagination={pagination} />
    </PageLayout>
  );
};

export default PostsIndex;

export const getStaticProps: GetStaticProps = (): { props: PostsIndexProps } => {
  const allPosts = fetchPostContent();
  const postCount = countPosts();

  const start = 0;
  const end = start + config.posts_per_page;
  const pagination = {
    start,
    total: postCount < end ? postCount - start : config.posts_per_page,
    current: 1,
    pages: Math.ceil(postCount / config.posts_per_page)
  };

  return {
    props: {
      allPosts,
      pagination
    }
  };
};
