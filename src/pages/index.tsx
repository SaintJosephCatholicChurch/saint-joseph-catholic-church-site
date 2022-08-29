import { serialize } from 'next-mdx-remote/serialize';
import { useEffect } from 'react';
import HomepageView from '../components/homepage/HomepageView';
import Layout from '../components/Layout';
import BasicMeta from '../components/meta/BasicMeta';
import OpenGraphMeta from '../components/meta/OpenGraphMeta';
import TwitterCardMeta from '../components/meta/TwitterCardMeta';
import { SerializedSlide } from '../interface';
import homePageData from '../lib/homepage';
import times from '../lib/times';
import useLocation from '../util/useLocation';
import useNavigate from '../util/useNavigate';

interface HomepageProps {
  slides: SerializedSlide[];
}

export default function Homepage({ slides }: HomepageProps) {
  const { hash = '', pathname = '' } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (hash === undefined || hash.trim() === '') {
      return;
    }

    const hashParts = hash.split('=');
    if (hashParts.length == 2) {
      switch (hashParts[0]) {
        case '#invite_token':
        case '#recovery_token':
        case '#email_change_token':
        case '#confirmation_token':
          navigate(`${pathname.replace(/\/$/g, '')}/admin${hash}`);
          return;
      }
    }
  }, [hash, navigate, pathname]);

  return (
    <Layout>
      <BasicMeta url={'/'} />
      <OpenGraphMeta url={'/'} />
      <TwitterCardMeta url={'/'} />
      <div>
        <HomepageView slides={slides} homePageData={homePageData} times={times} />
      </div>
    </Layout>
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
