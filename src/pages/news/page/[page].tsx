import PageLayout from '../../../components/PageLayout';
import PostListWithFlockNote from '../../../components/posts/PostListWithFlockNote';
import config from '../../../lib/config';
import homepageData from '../../../lib/homepage';
import { countPosts, fetchPostContent } from '../../../lib/posts';

import type { GetStaticPaths, GetStaticProps } from 'next/types';
import type { PostContent } from '../../../interface';

interface PostPageProps {
  allPosts: PostContent[];
  page: number;
  pagination: {
    start: number;
    total: number;
    current: number;
    pages: number;
  };
}

const PostPage = ({ allPosts, pagination, page }: PostPageProps) => {
  return (
    <PageLayout url={`/news/page/${page}`} title="News" dailyReadings={homepageData.daily_readings}>
      <PostListWithFlockNote allPosts={allPosts} pagination={pagination} />
    </PageLayout>
  );
};

export default PostPage;

export const getStaticPaths: GetStaticPaths = () => {
  const pages = Math.ceil(countPosts() / config.posts_per_page);
  const paths = Array.from(Array(pages - 1).keys()).map((it) => ({
    params: { page: (it + 2).toString() }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = ({ params }): { props: PostPageProps } => {
  const page = parseInt(params.page as string);
  const allPosts = fetchPostContent();
  const postCount = countPosts();

  const start = (page - 1) * config.posts_per_page;
  const end = start + config.posts_per_page;
  const pagination = {
    start,
    total: postCount < end ? postCount - start : config.posts_per_page,
    current: page,
    pages: Math.ceil(postCount / config.posts_per_page)
  };

  return {
    props: {
      page,
      allPosts,
      pagination
    }
  };
};
