import Head from 'next/head';

import HomepageView from '../components/homepage/HomepageView';
import Layout from '../components/Layout';
import BasicMeta from '../components/meta/BasicMeta';
import OpenGraphMeta from '../components/meta/OpenGraphMeta';
import TwitterCardMeta from '../components/meta/TwitterCardMeta';
import homePageData from '../lib/homepage';
import { getSidebarStaticProps } from '../lib/sidebar';
import times from '../lib/times';

import type { SidebarProps } from '../lib/sidebar';

type HomepageProps = SidebarProps;

const Homepage = ({ ...sidebarProps }: HomepageProps) => {
  return (
    <>
      <Head>
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js" async />
      </Head>
      <Layout>
        <BasicMeta url={'/'} />
        <OpenGraphMeta url={'/'} />
        <TwitterCardMeta url={'/'} />
        <div>
          <HomepageView homePageData={homePageData} times={times} {...sidebarProps} />
        </div>
      </Layout>
    </>
  );
};

export default Homepage;

export const getStaticProps = getSidebarStaticProps;
