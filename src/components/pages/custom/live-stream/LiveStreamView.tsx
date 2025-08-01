import { styled } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';

const EXTRA_BUTTON_HEIGHT = 67;

const StyledLiveStreamWrapper = styled('div')`
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
`;

interface LiveStreamViewProps {
  facebookPage: string;
  width: number;
}

const LiveStreamView = ({ facebookPage, width }: LiveStreamViewProps) => {
  const [height, setHeight] = useState(0);

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
    <StyledLiveStreamWrapper style={{ height: height + EXTRA_BUTTON_HEIGHT }}>
      <LiveStreamIFrameNoSSR width={width} height={height} facebookPage={facebookPage} />
    </StyledLiveStreamWrapper>
  );
};

export default LiveStreamView;
