import { styled } from '@mui/material/styles';

import PageLayout from '../components/PageLayout';
import LiveStreamView from '../components/pages/custom/live-stream/LiveStreamView';
import churchDetails from '../lib/church_details';
import { getSidebarStaticProps } from '../lib/sidebar';

import type { SidebarProps } from '../lib/sidebar';

const StyledLiveStreamPageContent = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type LiveStreamProps = SidebarProps;

const LiveStream = ({ ...sidebarProps }: LiveStreamProps) => {
  return (
    <PageLayout url="/live-stream" title="Live Stream" {...sidebarProps}>
      <StyledLiveStreamPageContent>
        <LiveStreamView
          livestreamProvider={churchDetails.livestream_provider}
          facebookPage={churchDetails.facebook_page}
          youtubeChannel={churchDetails.youtube_channel}
        />
      </StyledLiveStreamPageContent>
    </PageLayout>
  );
};

export default LiveStream;

export const getStaticProps = getSidebarStaticProps;
