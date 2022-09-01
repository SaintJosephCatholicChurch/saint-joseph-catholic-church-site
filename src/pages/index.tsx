import Head from 'next/head';
import HomepageView from '../components/homepage/HomepageView';
import Layout from '../components/Layout';
import BasicMeta from '../components/meta/BasicMeta';
import OpenGraphMeta from '../components/meta/OpenGraphMeta';
import TwitterCardMeta from '../components/meta/TwitterCardMeta';
import homePageData from '../lib/homepage';
import times from '../lib/times';

const Homepage = () => {
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
          <HomepageView homePageData={homePageData} times={times} />
        </div>
      </Layout>
    </>
  );
};

export default Homepage;
