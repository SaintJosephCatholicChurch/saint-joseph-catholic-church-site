'use client';
import FacebookIcon from '@mui/icons-material/Facebook';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';

import { EXTRA_EXTRA_SMALL_BREAKPOINT } from '../../../../constants';
import getContainerQuery from '../../../../util/container.util';
import { isEmpty } from '../../../../util/string.util';
import useLiveStreamUrl from './useLiveStreamUrl';

const EXTRA_BUTTON_HEIGHT = 67;

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
  padding-bottom: ${EXTRA_BUTTON_HEIGHT}px;
  box-sizing: border-box;
`;

interface LiveStreamIFrameProps {
  width: number;
  height: number;
  facebookPage: string;
}

const LiveStreamIFrame = ({ width, height, facebookPage }: LiveStreamIFrameProps) => {
  const theme = useTheme();

  const [shouldBeLoaded, setShouldBeLoaded] = useState(false);
  const [takingAwhile, setTakingAwhile] = useState(false);
  const { loading, url } = useLiveStreamUrl();

  useEffect(() => {
    setTimeout(() => {
      setShouldBeLoaded(true);
    }, 30000);

    setTimeout(() => {
      setTakingAwhile(true);
    }, 10000);
  }, []);

  const viewMoreButton = useMemo(
    () => (
      <Button
        key="view-more-buton"
        variant="contained"
        size="large"
        startIcon={<FacebookIcon />}
        href={`https://www.facebook.com/${facebookPage}/live`}
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
          [getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT))]: {
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
    [facebookPage, theme.breakpoints]
  );

  if (isEmpty(url)) {
    return shouldBeLoaded || !loading ? (
      <StyledCircularProgressWrapper key="failed-to-load">
        <Typography variant="h5" component="div">
          Failed to load Live Stream
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<FacebookIcon />}
          href={`https://www.facebook.com/${facebookPage}/live`}
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
            [getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT))]: {
              fontSize: '16px',
              '.MuiButton-startIcon > *:nth-of-type(1)': {
                fontSize: '20px'
              }
            }
          }}
        >
          View on Facebook
        </Button>
      </StyledCircularProgressWrapper>
    ) : (
      <StyledCircularProgressWrapper key="loading">
        <Typography variant="h5" component="div">
          Loading Live Stream
        </Typography>
        {takingAwhile ? (
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: '#bf303c',
              textAlign: 'center',
              paddingBottom: '12px',
              [getContainerQuery(theme.breakpoints.down('sm'))]: {
                fontSize: '16px',
                paddingBottom: '8px'
              }
            }}
          >
            It&apos;s taking a bit longer than expected
          </Typography>
        ) : null}
        <CircularProgress size="28px" />
      </StyledCircularProgressWrapper>
    );
  }

  return (
    <>
      <iframe
        key="facebook-livestream"
        src={url}
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
