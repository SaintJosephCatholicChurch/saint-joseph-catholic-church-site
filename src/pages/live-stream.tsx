import dynamic from 'next/dynamic';
import PageLayout from '../components/PageLayout';
import { getRecentPostsStaticProps, RecentPostsProps } from '../lib/posts';

type LiveStreamProps = RecentPostsProps;

const LiveStream = ({ recentPosts }: LiveStreamProps) => {
  const LiveStreamViewNoSSR = dynamic(() => import('../components/pages/custom/live-stream/LiveStreamView'), {
    ssr: false
  });

  return (
    <PageLayout url="/live-stream" title="Live Stream" recentPosts={recentPosts}>
      <LiveStreamViewNoSSR />
    </PageLayout>
  );
};

export default LiveStream;

export const getStaticProps = getRecentPostsStaticProps;
