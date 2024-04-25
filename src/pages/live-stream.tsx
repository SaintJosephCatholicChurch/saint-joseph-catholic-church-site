import { styled } from '@mui/material/styles';

import PageLayout from '../components/PageLayout';
import LiveStreamView from '../components/pages/custom/live-stream/LiveStreamView';
import churchDetails from '../lib/church_details';
import { getSidebarStaticProps } from '../lib/sidebar';
import useElementSize from '../util/useElementSize';
import { EXTRA_EXTRA_SMALL_BREAKPOINT, MAX_APP_WIDTH } from '../constants';
import getContainerQuery from '../util/container.util';

import type { SidebarProps } from '../lib/sidebar';

const StyledLiveStreamPageContent = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: ${MAX_APP_WIDTH - 48}px;

    ${getContainerQuery(theme.breakpoints.only('md'))} {
      max-width: calc(100vw - 64px);
    }

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      max-width: calc(100vw - 48px);
    }

    ${getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT))} {
      max-width: calc(100vw - 24px);
    }
  `
);

type LiveStreamProps = SidebarProps;

const LiveStream = ({ ...sidebarProps }: LiveStreamProps) => {
  const [ref, { width }] = useElementSize();

  return (
    <PageLayout url="/live-stream" title="Live Stream" {...sidebarProps}>
      <StyledLiveStreamPageContent ref={ref}>
        <LiveStreamView facebookPage={churchDetails.facebook_page} width={width} />
      </StyledLiveStreamPageContent>
    </PageLayout>
  );
};

export default LiveStream;

export const getStaticProps = getSidebarStaticProps;
