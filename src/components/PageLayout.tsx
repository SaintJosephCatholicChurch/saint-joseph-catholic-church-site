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
  pageDetails?: {
    date: Date;
    image?: string;
  };
  hideHeader?: boolean;
  hideSidebar?: boolean;
  disableTitleMargin?: boolean;
  disableBottomMargin?: boolean;
  disablePadding?: boolean;
  fullWidth?: boolean;
}

const PageLayout = ({
  children,
  title,
  url,
  description,
  tags,
  pageDetails,
  hideHeader,
  hideSidebar,
  disableTitleMargin,
  disableBottomMargin,
  disablePadding,
  fullWidth
}: PageProps) => {
  const keywords = tags?.map((tag) => getTag(tag)?.name).filter((keyword) => isNotEmpty(keyword));
  return (
    <Layout>
      <BasicMeta url={url} title={title} keywords={keywords} description={description} />
      <OpenGraphMeta url={url} title={title} image={pageDetails?.image} description={description} />
      <TwitterCardMeta url={url} title={title} description={description} />
      {pageDetails ? (
        <JsonLdMeta
          url={url}
          title={title}
          keywords={keywords}
          date={pageDetails.date}
          image={pageDetails.image}
          description={description}
        />
      ) : null}
      <PageView
        title={title}
        hideHeader={hideHeader}
        hideSidebar={hideSidebar}
        disablePadding={disablePadding}
        disableTitleMargin={disableTitleMargin}
        disableBottomMargin={disableBottomMargin}
        fullWidth={fullWidth}
      >
        {children}
      </PageView>
      <Footer churchDetails={churchDetails} />
    </Layout>
  );
};

export default PageLayout;
