import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';

import { EXTRA_EXTRA_SMALL_BREAKPOINT } from '../../../../constants';
import { isEmpty } from '../../../../util/string.util';
import useLiveStreamUrl from './useLiveStreamUrl';

const StyledCircularProgressWrapper = styled('div')`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

interface LiveStreamIFrameProps {
  width: number;
  height: number;
  livestreamProvider: 'youtube' | 'facebook';
  facebookPage: string;
  youtubeChannel: string;
}

const LiveStreamIFrame = ({
  width,
  height,
  livestreamProvider,
  facebookPage,
  youtubeChannel
}: LiveStreamIFrameProps) => {
  const theme = useTheme();

  const [shouldBeLoaded, setShouldBeLoaded] = useState(false);
  const [loading, livestreamUrl] = useLiveStreamUrl({ livestreamProvider, facebookPage, youtubeChannel });

  useEffect(() => {
    setTimeout(() => {
      setShouldBeLoaded(true);
    }, 10000);
  }, []);

  const viewMoreButton = useMemo(
    () => (
      <Button
        key="view-more-buton"
        variant="contained"
        size="large"
        startIcon={livestreamProvider === 'youtube' ? <YouTubeIcon /> : <FacebookIcon />}
        href={
          livestreamProvider === 'youtube'
            ? `https://youtube.com/channel/${youtubeChannel}/live`
            : `https://www.facebook.com/${facebookPage}/live`
        }
        target="_blank"
        sx={{
          marginTop: '16px',
          fontSize: '20px',
          backgroundColor: '#bc2f3b',
          '&:hover': {
            backgroundColor: '#d24c57',
            color: '#ffffff'
          },
          '.MuiButton-startIcon > *:nth-of-type(1)': {
            fontSize: '24px'
          },
          [theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)]: {
            fontSize: '16px',
            '.MuiButton-startIcon > *:nth-of-type(1)': {
              fontSize: '20px'
            }
          }
        }}
      >
        View past streams
      </Button>
    ),
    [facebookPage, livestreamProvider, theme.breakpoints, youtubeChannel]
  );

  if (isEmpty(livestreamUrl)) {
    return (
      <StyledCircularProgressWrapper>
        {shouldBeLoaded || !loading ? (
          <div key="failed-to-load">
            <Typography variant="h5" component="div">
              Failed to load Live Stream
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={livestreamProvider === 'youtube' ? <YouTubeIcon /> : <FacebookIcon />}
              href={
                livestreamProvider === 'youtube'
                  ? `https://youtube.com/channel/${youtubeChannel}/live`
                  : `https://www.facebook.com/${facebookPage}/live`
              }
              target="_blank"
              sx={{
                marginTop: '16px',
                fontSize: '20px',
                backgroundColor: '#bc2f3b',
                '&:hover': {
                  backgroundColor: '#d24c57',
                  color: '#ffffff'
                },
                '.MuiButton-startIcon > *:nth-of-type(1)': {
                  fontSize: '24px'
                },
                [theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)]: {
                  fontSize: '16px',
                  '.MuiButton-startIcon > *:nth-of-type(1)': {
                    fontSize: '20px'
                  }
                }
              }}
            >
              View on {livestreamProvider === 'youtube' ? 'YouTube' : 'Facebook'}
            </Button>
          </div>
        ) : (
          <>
            <Typography key="loading" variant="h5" component="div">
              Loading
            </Typography>
            <CircularProgress key="loading-indicator" size="28px" />
          </>
        )}
      </StyledCircularProgressWrapper>
    );
  }

  if (livestreamProvider === 'youtube') {
    return (
      <>
        <iframe
          key="youtube-livestream"
          width={width}
          height={height}
          src={livestreamUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
        {viewMoreButton}
      </>
    );
  }

  return (
    <>
      <iframe
        key="facebook-livestream"
        src={livestreamUrl}
        width={width}
        height={height}
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
        frameBorder={0}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen={true}
      ></iframe>
      {viewMoreButton}
    </>
  );
};

export default LiveStreamIFrame;
