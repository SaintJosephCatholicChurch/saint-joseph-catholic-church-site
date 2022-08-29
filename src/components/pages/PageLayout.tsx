import React from 'react';
import { getTag } from '../../lib/tags';
import Layout from '../Layout';
import Footer from '../layout/footer/Footer';
import BasicMeta from '../meta/BasicMeta';
import JsonLdMeta from '../meta/JsonLdMeta';
import OpenGraphMeta from '../meta/OpenGraphMeta';
import TwitterCardMeta from '../meta/TwitterCardMeta';
import PageView from './PageView';

interface PageLayoutProps {
  title: string;
  date?: Date;
  slug?: string;
  tags?: string[];
  description?: string;
  children: React.ReactNode;
}

const PageLayout = ({ title, date, slug, tags = [], description = '', children }: PageLayoutProps) => {
  const keywords = tags.map((it) => getTag(it)?.name ?? 'N/A');
  return (
    <Layout>
      <BasicMeta url={`/pages/${slug}`} title={title} keywords={keywords} description={description} />
      <TwitterCardMeta url={`/pages/${slug}`} title={title} description={description} />
      <OpenGraphMeta url={`/pages/${slug}`} title={title} description={description} />
      <JsonLdMeta url={`/pages/${slug}`} title={title} keywords={keywords} date={date} description={description} />
      <PageView title={title} tags={tags}>
        {children}
      </PageView>
      <Footer />
    </Layout>
  );
};

export default PageLayout;
