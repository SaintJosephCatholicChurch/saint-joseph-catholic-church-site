import { styled } from '@mui/material/styles';
import parseISO from 'date-fns/parseISO';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useMemo } from 'react';
import PageLayout from '../../components/PageLayout';
import PageContent from '../../components/pages/PageContent';
import PostDateAuthorLine from '../../components/posts/PostDateAuthorLine';
import PostImage from '../../components/posts/PostImage';
import PostTitle from '../../components/posts/PostTitle';
import { PostContent } from '../../interface';
import { fetchPostContent } from '../../lib/posts';

const StyledPageContentWrapper = styled('div')`
  margin-top: 32px;
`;

export type Props = {
  title: string;
  image: string;
  dateString: string;
  slug: string;
  tags: string[];
  description?: string;
  source: MDXRemoteProps;
};

export default function Post({ title, image, dateString, slug, tags, description = '', source }: Props) {
  const date = useMemo(() => parseISO(dateString), [dateString]);

  return (
    <PageLayout
      url={`/pages/${slug}`}
      title={title}
      postDetails={{ date, image }}
      tags={tags}
      description={description}
      showHeader={false}
    >
      <PostTitle title={title} />
      <PostDateAuthorLine date={date} />
      <PostImage title={title} image={image} />
      <StyledPageContentWrapper>
        <PageContent>
          <MDXRemote {...source} />
        </PageContent>
      </StyledPageContentWrapper>
    </PageLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = fetchPostContent().map((post) => '/posts/' + post.data.slug);
  return {
    paths,
    fallback: false
  };
};

const slugToPostContent: Record<string, PostContent> = ((postContents) => {
  let hash = {};
  postContents.forEach((post) => (hash[post.data.slug] = post));
  return hash;
})(fetchPostContent());

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params.post as string;
  const { content, data } = slugToPostContent[slug];
  const mdxSource = await serialize(content, { scope: data as Record<string, any> });
  return {
    props: {
      title: data.title,
      image: data.image,
      dateString: data.date,
      slug: data.slug,
      description: '',
      tags: data.tags ?? [],
      source: mdxSource
    }
  };
};
