import PageLayout from '../../components/PageLayout';
import LiveStreamPageContent from '../../components/pages/custom/live-stream/LiveStreamPageContent';
import churchDetails from '../../lib/church_details';
import { getSidebarProps } from '../../lib/sidebar';
import { generateBasicMeta } from '../../meta/BasicMeta';
import { generateOpenGraphMeta } from '../../meta/OpenGraphMeta';
import { generateTwitterCardMeta } from '../../meta/TwitterCardMeta';

import type { Metadata } from 'next';

const url = '/live-stream';
const title = 'Live Stream';

export const metadata: Metadata = {
  ...generateBasicMeta({ url, title }),
  ...generateOpenGraphMeta({ url, title }),
  ...generateTwitterCardMeta({ url, title })
};

const LiveStream = async () => {
  const sidebarProps = await getSidebarProps();

  return (
    <PageLayout url={url} title={title} {...sidebarProps}>
      <LiveStreamPageContent facebookPage={churchDetails.facebook_page} />
    </PageLayout>
  );
};

export default LiveStream;
