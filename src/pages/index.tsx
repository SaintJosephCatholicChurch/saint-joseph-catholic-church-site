import { serialize } from 'next-mdx-remote/serialize';
import Head from 'next/head';
import HomepageView from '../components/homepage/HomepageView';
import Layout from '../components/Layout';
import BasicMeta from '../components/meta/BasicMeta';
import OpenGraphMeta from '../components/meta/OpenGraphMeta';
import TwitterCardMeta from '../components/meta/TwitterCardMeta';
import { SerializedSlide } from '../interface';
import homePageData from '../lib/homepage';
import times from '../lib/times';

interface HomepageProps {
  slides: SerializedSlide[];
}

export default function Homepage({ slides }: HomepageProps) {
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
          <HomepageView slides={slides} homePageData={homePageData} times={times} />
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const serializedSlides: SerializedSlide[] = [];
  for (const slide of homePageData.slides) {
    const mdxTitle = await serialize(slide.title);
    serializedSlides.push({
      image: slide.image,
      titleSource: mdxTitle
    });
  }

  return { props: { slides: serializedSlides } };
}
