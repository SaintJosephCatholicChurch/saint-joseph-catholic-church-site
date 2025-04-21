import HomepageView from '../components/homepage/HomepageView';
import Layout from '../components/Layout';
import homePageData from '../lib/homepage';
import { getSidebarProps } from '../lib/sidebar';
import times from '../lib/times';
import { generateBasicMeta } from '../meta/BasicMeta';
import { generateOpenGraphMeta } from '../meta/OpenGraphMeta';
import { generateTwitterCardMeta } from '../meta/TwitterCardMeta';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  ...generateBasicMeta({ url: '/' }),
  ...generateOpenGraphMeta({ url: '/' }),
  ...generateTwitterCardMeta({ url: '/' })
};

const Homepage = async () => {
  const sidebarProps = await getSidebarProps();

  return (
    <>
      <Layout>
        <div>
          <HomepageView homePageData={homePageData} times={times} {...sidebarProps} />
        </div>
      </Layout>
    </>
  );
};

export default Homepage;
