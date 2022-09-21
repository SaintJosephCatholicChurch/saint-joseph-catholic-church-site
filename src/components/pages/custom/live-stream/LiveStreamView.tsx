import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import useElementSize from '../../../../util/useElementSize';

const StyledLiveStreamWrapper = styled('div')`
  width: 100%;
  display: flex;
`;

const LiveStreamView = () => {
  const [height, setHeight] = useState(0);
  const [ref, { width }] = useElementSize();

  useEffect(() => {
    setHeight((width / 16) * 9);
  }, [width]);

  return (
    <StyledLiveStreamWrapper ref={ref}>
      <iframe
        src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fstjosephchurchbluffton%2Flive&show_text=false"
        width={width}
        height={height}
        style={{
          border: 'none',
          overflow: 'hidden'
        }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </StyledLiveStreamWrapper>
  );
};

export default LiveStreamView;
