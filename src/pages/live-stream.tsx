import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import PageLayout from '../components/PageLayout';
import { getSidebarStaticProps, SidebarProps } from '../lib/sidebar';

type LiveStreamProps = SidebarProps;

const LiveStream = ({ ...sidebarProps }: LiveStreamProps) => {
  const LiveStreamViewNoSSR = useMemo(
    () =>
      dynamic(() => import('../components/pages/custom/live-stream/LiveStreamView'), {
        ssr: false
      }),
    []
  );

  return (
    <PageLayout url="/live-stream" title="Live Stream" {...sidebarProps}>
      <LiveStreamViewNoSSR />
    </PageLayout>
  );
};

export default LiveStream;

export const getStaticProps = getSidebarStaticProps;
