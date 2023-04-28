import { styled } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';

import useElementSize from '../../../../util/useElementSize';

const EXTRA_BUTTON_HEIGHT = 67;

const StyledLiveStreamWrapper = styled('div')`
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
`;

interface LiveStreamViewProps {
  livestreamProvider: 'youtube' | 'facebook';
  facebookPage: string;
  youtubeChannel: string;
}

const LiveStreamView = ({ livestreamProvider, facebookPage, youtubeChannel }: LiveStreamViewProps) => {
  const [height, setHeight] = useState(0);
  const [ref, { width }] = useElementSize();

  useEffect(() => {
    setHeight(Math.floor((width / 16) * 9));
  }, [width]);

  const LiveStreamIFrameNoSSR = useMemo(
    () =>
      dynamic(() => import('./LiveStreamIFrame'), {
        ssr: false
      }),
    []
  );

  return (
    <StyledLiveStreamWrapper ref={ref} style={{ height: height + EXTRA_BUTTON_HEIGHT }}>
      <LiveStreamIFrameNoSSR
        width={width}
        height={height}
        livestreamProvider={livestreamProvider}
        facebookPage={facebookPage}
        youtubeChannel={youtubeChannel}
      />
    </StyledLiveStreamWrapper>
  );
};

export default LiveStreamView;
