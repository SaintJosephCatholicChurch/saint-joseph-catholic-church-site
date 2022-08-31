import { GetStaticPaths, GetStaticProps } from 'next/types';
import { serialize } from 'next-mdx-remote/serialize';
import { useMemo } from 'react';
import PageLayout from '../../../components/PageLayout';
import TagPostList from '../../../components/TagPostList';
import { SerializedPostContent, TagContent } from '../../../interface';
import config from '../../../lib/config';
import { countPosts, listPostContent } from '../../../lib/posts';
import { getTag, listTags } from '../../../lib/tags';

interface TagsIndexProps {
  posts: SerializedPostContent[];
  tag: TagContent;
  page?: string;
  pagination: {
    current: number;
    pages: number;
  };
}

const TagsIndex = ({ posts, tag, pagination, page }: TagsIndexProps) => {
  const url = useMemo(() => `/posts/tags/${tag.name}` + (page ? `/${page}` : ''), [page, tag.name]);
  return (
    <PageLayout url={url} title={tag.name}>
      <TagPostList posts={posts} tag={tag} pagination={pagination} />
    </PageLayout>
  );
};

export default TagsIndex;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = listTags().flatMap((tag) => {
    const pages = Math.ceil(countPosts(tag.slug) / config.posts_per_page);
    return Array.from(Array(pages).keys()).map((page) =>
      page === 0
        ? {
            params: { slug: [tag.slug] }
          }
        : {
            params: { slug: [tag.slug, (page + 1).toString()] }
          }
    );
  });
  return {
    paths: paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }): Promise<{ props: TagsIndexProps }> => {
  const queries = params.slug as string[];
  const [slug, page] = [queries[0], queries[1]];
  const posts = listPostContent(page ? parseInt(page as string) : 1, config.posts_per_page, slug);
  const tag = getTag(slug);
  const pagination = {
    current: page ? parseInt(page as string) : 1,
    pages: Math.ceil(countPosts(slug) / config.posts_per_page)
  };

  const serializedPostContent: SerializedPostContent[] = [];
  for (const { summary, data, fullPath } of posts) {
    serializedPostContent.push({
      fullPath,
      data,
      source: await serialize(summary, { scope: data as Record<string, any> })
    });
  }

  const props: TagsIndexProps = { posts: serializedPostContent, tag, pagination };

  if (page) {
    props.page = page;
  }

  return {
    props
  };
};
