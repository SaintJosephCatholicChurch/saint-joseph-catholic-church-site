'use client';

import Footer from '../components/layout/footer/Footer';
import PageView from '../components/pages/PageView';
import Layout from '../components/Layout';
import churchDetails from '../lib/church_details';
import config from '../lib/config';

import type { ReactNode } from 'react';
import type { DailyReadings, PostContent } from '../interface';

interface AppPageShellProps {
  children: ReactNode;
  title: string;
  hideHeader?: boolean;
  hideSidebar?: boolean;
  hideSearch?: boolean;
  disableBottomMargin?: boolean;
  disablePadding?: boolean;
  fullWidth?: boolean;
  recentPosts?: PostContent[];
  dailyReadings?: DailyReadings;
}

const AppPageShell = ({
  children,
  title,
  hideHeader,
  hideSidebar,
  hideSearch,
  disableBottomMargin,
  disablePadding,
  fullWidth,
  recentPosts,
  dailyReadings
}: AppPageShellProps) => {
  return (
    <Layout>
      <PageView
        title={title}
        hideHeader={hideHeader}
        hideSidebar={hideSidebar}
        hideSearch={hideSearch}
        disableBottomMargin={disableBottomMargin}
        disablePadding={disablePadding}
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

export default AppPageShell;
