import { parseISO } from 'date-fns';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { GetStaticPaths, GetStaticProps } from 'next/types';
import remarkGfm from 'remark-gfm';
import PageLayout from '../components/PageLayout';
import PageContentView from '../components/pages/PageContentView';
import { PageContent } from '../interface';
import { fetchPageContent } from '../lib/pages';

interface PageProps {
  title: string;
  dateString: string;
  slug: string;
  tags: string[];
  description?: string;
  source: MDXRemoteProps;
}

const Page = ({ title, dateString, slug, tags, description = '', source }: PageProps) => {
  return (
    <PageLayout
      url={`/pages/${slug}`}
      title={title}
      pageDetails={{ date: parseISO(dateString) }}
      tags={tags}
      description={description}
    >
      <PageContentView tags={tags}>
        <MDXRemote {...source} />
      </PageContentView>
    </PageLayout>
  );
};

export default Page;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = fetchPageContent().map((it) => '/' + it.data.slug);
  return {
    paths,
    fallback: false
  };
};

const slugToPageContent: Record<string, PageContent> = ((pageContents) => {
  let hash = {};
  pageContents.forEach((page) => (hash[page.data.slug] = page));
  return hash;
})(fetchPageContent());

export const getStaticProps: GetStaticProps = async ({ params }): Promise<{ props: PageProps }> => {
  const slug = params.page as string;
  const { content, data } = slugToPageContent[slug];
  const mdxSource = await serialize(content, {
    scope: data as Record<string, any>,
    mdxOptions: { remarkPlugins: [remarkGfm] }
  });

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
