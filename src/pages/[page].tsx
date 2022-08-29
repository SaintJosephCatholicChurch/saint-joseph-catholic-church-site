import { parseISO } from 'date-fns';
import fs from 'fs';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import InstagramEmbed from 'react-instagram-embed';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import YouTube from 'react-youtube';
import remarkGfm from 'remark-gfm';
import PageLayout from '../components/pages/PageLayout';
import { fetchPageContent } from '../lib/pages';

export type Props = {
  title: string;
  dateString: string;
  slug: string;
  tags: string[];
  description?: string;
  source: MDXRemoteProps;
};

const components = { InstagramEmbed, YouTube, TwitterTweetEmbed };
const slugToPageContent = ((pageContents) => {
  let hash = {};
  pageContents.forEach((it) => (hash[it.slug] = it));
  return hash;
})(fetchPageContent());

export default function Page({ title, dateString, slug, tags, description = '', source }: Props) {
  return (
    <PageLayout title={title} date={parseISO(dateString)} slug={slug} tags={tags} description={description}>
      <MDXRemote {...source} components={components} />
    </PageLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = fetchPageContent().map((it) => '/' + it.slug);
  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params.page as string;
  const source = fs.readFileSync(slugToPageContent[slug].fullPath, 'utf8');
  const { content, data } = matter(source, {
    engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object }
  });
  const mdxSource = await serialize(content, { scope: data, mdxOptions: { remarkPlugins: [remarkGfm] } });
  return {
    props: {
      title: data.title,
      dateString: data.date,
      slug: data.slug,
      description: '',
      tags: data.tags ?? [],
      source: mdxSource
    }
  };
};
