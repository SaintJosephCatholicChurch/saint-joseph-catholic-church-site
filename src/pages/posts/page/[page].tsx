import { GetStaticPaths, GetStaticProps } from 'next';
import PageLayout from '../../../components/PageLayout';
import PostList from '../../../components/PostList';
import config from '../../../lib/config';
import { countPosts, listPostContent, PostContent } from '../../../lib/posts';
import { listTags, TagContent } from '../../../lib/tags';

type Props = {
  posts: PostContent[];
  tags: TagContent[];
  page: number;
  pagination: {
    current: number;
    pages: number;
  };
};
export default function Page({ posts, tags, pagination, page }: Props) {
  return (
    <PageLayout url={`/posts/page/${page}`} title="News">
      <PostList posts={posts} tags={tags} pagination={pagination} />
    </PageLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const page = parseInt(params.page as string);
  const posts = listPostContent(page, config.posts_per_page);
  const tags = listTags();
  const pagination = {
    current: page,
    pages: Math.ceil(countPosts() / config.posts_per_page)
  };
  return {
    props: {
      page,
      posts,
      tags,
      pagination
    }
  };
};

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
