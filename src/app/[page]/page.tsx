import { parseISO } from 'date-fns';

import PageLayout from '../../components/PageLayout';
import PageContentView from '../../components/pages/PageContentView';
import { fetchPageContent } from '../../lib/pages';
import { getSidebarProps } from '../../lib/sidebar';
import { generateBasicMeta } from '../../meta/BasicMeta';
import { generateOpenGraphMeta } from '../../meta/OpenGraphMeta';
import { generateTwitterCardMeta } from '../../meta/TwitterCardMeta';

import type { Metadata } from 'next/types';
import type { PageContent, PageProps } from '../../interface';

const buildSlugToPageContent = (pageContents: PageContent[]) => {
  const hash: Record<string, PageContent> = {};
  pageContents.forEach((page) => (hash[page.data.slug] = page));
  return hash;
};

let slugToPageContent: Record<string, PageContent> | null = null;

export const getData = async ({ params }: PageProps) => {
  const slug = params.page as string;

  if (process.env.NODE_ENV === 'development' || slugToPageContent == null) {
    const pages = await fetchPageContent();
    slugToPageContent = buildSlugToPageContent(pages);
  }

  const { content, data } = slugToPageContent[slug];

  return {
    title: data.title,
    dateString: data.date,
    slug: data.slug,
    description: '',
    content
  };
};

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const { title, slug, description } = await getData(props);

  const url = `/${slug}`;

  return {
    ...generateBasicMeta({ url, title, description }),
    ...generateOpenGraphMeta({ url, title, description }),
    ...generateTwitterCardMeta({ url, title, description })
  };
};

export const generateStaticParams = async (): Promise<Record<string, unknown>[]> => {
  const pages = await fetchPageContent();
  return pages.map((it) => ({
    page: it.data.slug
  }));
};

const Page = async (props: PageProps) => {
  const { title, dateString, slug, description, content } = await getData(props);
  const sidebarProps = await getSidebarProps();

  return (
    <PageLayout
      url={`/${slug}`}
      title={title}
      pageDetails={{ date: parseISO(dateString) }}
      description={description}
      {...sidebarProps}
    >
      <PageContentView>
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
