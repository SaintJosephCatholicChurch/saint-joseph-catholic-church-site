import { ReactNode } from 'react';
import churchDetails from '../lib/church_details';
import { getTag } from '../lib/tags';
import { isNotEmpty } from '../util/string.util';
import Layout from './Layout';
import Footer from './layout/footer/Footer';
import BasicMeta from './meta/BasicMeta';
import JsonLdMeta from './meta/JsonLdMeta';
import OpenGraphMeta from './meta/OpenGraphMeta';
import TwitterCardMeta from './meta/TwitterCardMeta';
import PageView from './pages/PageView';

interface PageProps {
  children: ReactNode;
  title?: string;
  url: string;
  description?: string;
  tags?: string[];
  postDetails?: {
    date: Date;
    image?: string;
  };
  showHeader?: boolean;
}

const PageLayout = ({ children, title, url, description, tags, postDetails, showHeader = true }: PageProps) => {
  const keywords = tags?.map((tag) => getTag(tag)?.name).filter((keyword) => isNotEmpty(keyword));
  return (
    <Layout>
      <BasicMeta url={url} title={title} keywords={keywords} description={description} />
      <OpenGraphMeta url={url} title={title} image={postDetails?.image} description={description} />
      <TwitterCardMeta url={url} title={title} description={description} />
      {postDetails ? (
        <JsonLdMeta
          url={url}
          title={title}
          keywords={keywords}
          date={postDetails.date}
          image={postDetails.image}
          description={description}
        />
      ) : null}
      <PageView title={title} showHeader={showHeader}>
        {children}
      </PageView>
      <Footer churchDetails={churchDetails} />
    </Layout>
  );
};

export default PageLayout;
