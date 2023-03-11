import { styled } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';

import useElementSize from '../../../../util/useElementSize';

const StyledLiveStreamWrapper = styled('div')`
  width: 100%;
  display: flex;
`;

interface LiveStreamViewProps {
  facebookPage: string;
}

const LiveStreamView = ({ facebookPage }: LiveStreamViewProps) => {
  const [height, setHeight] = useState(0);
  const [ref, { width }] = useElementSize();

  useEffect(() => {
    setHeight((width / 16) * 9);
  }, [width]);

  const LiveStreamIFrameNoSSR = useMemo(
    () =>
      dynamic(() => import('./LiveStreamIFrame'), {
        ssr: false
      }),
    []
  );

  return (
    <StyledLiveStreamWrapper ref={ref} style={{ height }}>
      <LiveStreamIFrameNoSSR width={width} height={height} facebookPage={facebookPage} />
    </StyledLiveStreamWrapper>
  );
};

export default LiveStreamView;
