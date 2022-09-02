import parseISO from 'date-fns/parseISO';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import PageLayout from '../components/PageLayout';
import PageContentView from '../components/pages/PageContentView';
import type { PageContent } from '../interface';
import { fetchPageContent } from '../lib/pages';

interface PageProps {
  title: string;
  dateString: string;
  slug: string;
  tags: string[];
  description?: string;
  content: string;
}

const Page = ({ title, dateString, slug, tags, description = '', content }: PageProps) => {
  return (
    <PageLayout
      url={`/pages/${slug}`}
      title={title}
      pageDetails={{ date: parseISO(dateString) }}
      tags={tags}
      description={description}
    >
      <PageContentView tags={tags}>
        <div
          dangerouslySetInnerHTML={{
            __html: content
          }}
        />
      </PageContentView>
    </PageLayout>
  );
};

export default Page;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = fetchPageContent().map((it) => `/${it.data.slug}`);
  return {
    paths,
    fallback: false
  };
};

const buildSlugToPageContent = (pageContents: PageContent[]) => {
  const hash: Record<string, PageContent> = {};
  pageContents.forEach((page) => (hash[page.data.slug] = page));
  return hash;
};

let slugToPageContent = buildSlugToPageContent(fetchPageContent());

export const getStaticProps: GetStaticProps = async ({ params }): Promise<{ props: PageProps }> => {
  const slug = params.page as string;

  if (process.env.NODE_ENV === 'development') {
    slugToPageContent = buildSlugToPageContent(fetchPageContent());
  }

  const { content, data } = slugToPageContent[slug];

  return {
    props: {
      title: data.title,
      dateString: data.date,
      slug: data.slug,
      description: '',
      tags: data.tags ?? [],
      content
    }
  };
};
