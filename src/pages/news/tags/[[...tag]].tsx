import { styled } from '@mui/material/styles';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import { useMemo } from 'react';
import { StyledLink } from '../../../components/common/StyledLink';
import PageLayout from '../../../components/PageLayout';
import PageTitle from '../../../components/pages/PageTitle';
import TagPostList from '../../../components/TagPostList';
import type { PostContent } from '../../../interface';
import config from '../../../lib/config';
import { countPosts, listPostContent } from '../../../lib/posts';
import { listTags } from '../../../lib/tags';

const StyledTitle = styled('div')`
  display: flex;
`;

interface TagsIndexProps {
  posts: PostContent[];
  tag: string;
  page?: string;
  pagination: {
    current: number;
    pages: number;
  };
}

const TagsIndex = ({ posts, tag, pagination, page }: TagsIndexProps) => {
  const url = useMemo(() => `/news/tags/${tag}` + (page ? `/${page}` : ''), [page, tag]);
  return (
    <PageLayout url={url} title={`#${tag}`} hideHeader>
      <PageTitle
        title={
          <StyledTitle>
            <Link href="/news">
              <StyledLink>News</StyledLink>
            </Link>
            &nbsp;/&nbsp;#{tag}
          </StyledTitle>
        }
      />
      <TagPostList posts={posts} tag={tag} pagination={pagination} />
    </PageLayout>
  );
};

export default TagsIndex;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = listTags().flatMap((tag) => {
    const pages = Math.ceil(countPosts(tag) / config.posts_per_page);
    return Array.from(Array(pages).keys()).map((page) =>
      page === 0
        ? {
            params: { tag: [tag] }
          }
        : {
            params: { tag: [tag, (page + 1).toString()] }
          }
    );
  });
  return {
    paths: paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }): Promise<{ props: TagsIndexProps }> => {
  const queries = params.tag as string[];
  const [tag, page] = [queries[0], queries[1]];
  const posts = listPostContent(page ? parseInt(page as string) : 1, config.posts_per_page, tag);
  const pagination = {
    current: page ? parseInt(page as string) : 1,
    pages: Math.ceil(countPosts(tag) / config.posts_per_page)
  };

  const props: TagsIndexProps = { posts, tag, pagination };

  if (page) {
    props.page = page;
  }

  return {
    props
  };
};
