import Box from '@mui/material/Box';
import { useEffect, useRef, useState } from 'react';
import PageLayout from '../components/pages/PageLayout';

const LiveStream = () => {
  const ref = useRef(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight((ref.current.offsetWidth / 16) * 9);
  }, []);

  return (
    <PageLayout title="Live Stream">
      <Box ref={ref} sx={{ width: '100%', display: 'flex' }}>
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
      </Box>
    </PageLayout>
  );
};

export default LiveStream;
