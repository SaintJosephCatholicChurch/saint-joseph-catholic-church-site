import churchDetails from '../lib/church_details';
import config from '../lib/config';
import { isNotEmpty } from '../util/string.util';
import Layout from './Layout';
import Footer from './layout/footer/Footer';
import BasicMeta from './meta/BasicMeta';
import JsonLdMeta from './meta/JsonLdMeta';
import OpenGraphMeta from './meta/OpenGraphMeta';
import TwitterCardMeta from './meta/TwitterCardMeta';
import PageView from './pages/PageView';

import type { ReactNode } from 'react';
import type { DailyReadings, PostContent } from '../interface';

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
  hideSearch?: boolean;
  disableBottomMargin?: boolean;
  disablePadding?: boolean;
  fullWidth?: boolean;
  recentPosts?: PostContent[];
  dailyReadings?: DailyReadings;
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
  hideSearch,
  disableBottomMargin,
  disablePadding,
  fullWidth,
  recentPosts,
  dailyReadings
}: PageProps) => {
  const keywords = tags?.filter((keyword) => isNotEmpty(keyword));
  return (
    <Layout>
      <BasicMeta url={url} title={title} keywords={keywords} description={description} />
      <OpenGraphMeta url={url} title={title} image={pageDetails?.image} description={description} />
      <TwitterCardMeta url={url} title={title} image={pageDetails?.image} description={description} />
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
        hideSearch={hideSearch}
        disablePadding={disablePadding}
        disableBottomMargin={disableBottomMargin}
        fullWidth={fullWidth}
        recentPosts={recentPosts}
        dailyReadings={dailyReadings}
      >
        {children}
      </PageView>
      <Footer churchDetails={churchDetails} privacyPolicyLink={config.privacy_policy_url} />
    </Layout>
  );
};

export default PageLayout;
