'use client';

import Layout from '../components/Layout';
import HomepageView from '../components/homepage/HomepageView';
import homePageData from '../lib/homepage';
import times from '../lib/times';

import type { SidebarProps } from '../lib/sidebar';

type HomepagePageProps = SidebarProps;

const HomepagePage = ({ ...sidebarProps }: HomepagePageProps) => {
  return (
    <Layout>
      <div>
        <HomepageView homePageData={homePageData} times={times} {...sidebarProps} />
      </div>
    </Layout>
  );
};

export default HomepagePage;
