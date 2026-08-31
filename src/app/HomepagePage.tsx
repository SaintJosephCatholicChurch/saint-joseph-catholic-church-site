'use client';

import Layout from '../components/Layout';
import HomepageView from '../components/homepage/HomepageView';
import churchDetails from '../lib/church_details';
import config from '../lib/config';
import homePageData from '../lib/homepage';
import times from '../lib/times';

import type { SidebarProps } from '../lib/sidebar';

type HomepagePageProps = SidebarProps;

const HomepagePage = ({ ...sidebarProps }: HomepagePageProps) => {
  return (
    <Layout>
      <div>
        <HomepageView
          churchDetails={churchDetails}
          homePageData={homePageData}
          privacyPolicyUrl={config.privacy_policy_url}
          times={times}
          {...sidebarProps}
        />
      </div>
    </Layout>
  );
};

export default HomepagePage;
