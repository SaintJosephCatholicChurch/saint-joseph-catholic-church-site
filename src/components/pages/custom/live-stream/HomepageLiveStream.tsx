import FacebookIcon from '@mui/icons-material/Facebook';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { EXTRA_EXTRA_SMALL_BREAKPOINT } from '../../../../constants';
import getContainerQuery from '../../../../util/container.util';
import { isNotEmpty } from '../../../../util/string.util';
import useElementSize from '../../../../util/useElementSize';
import useLiveStreamUrl from './useLiveStreamUrl';

import type { LiveStreamButton } from '../../../../interface';

const EXTRA_BUTTON_HEIGHT = 67;

const StyledLiveStreamWrapper = styled('div')`
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
`;

interface HomepageLiveStreamProps {
  facebookPage: string;
  liveStreamButton?: LiveStreamButton;
}

const HomepageLiveStream = ({ facebookPage, liveStreamButton }: HomepageLiveStreamProps) => {
  const theme = useTheme();
  const { loading, url, isStreaming } = useLiveStreamUrl();

  const [height, setHeight] = useState(0);
  const [ref, { width }] = useElementSize();

  useEffect(() => {
    setHeight(Math.floor((width / 16) * 9));
  }, [width]);

  return !loading && isNotEmpty(url) && !isStreaming ? (
    <StyledLiveStreamWrapper ref={ref} style={{ height: height + EXTRA_BUTTON_HEIGHT }}>
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
      {
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
      }
    </StyledLiveStreamWrapper>
  ) : isNotEmpty(liveStreamButton?.url) && isNotEmpty(liveStreamButton?.title) ? (
    <Link key="live-stream-button" href={liveStreamButton.url}>
      <Button
        variant="contained"
        size="large"
        startIcon={<LiveTvIcon />}
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
        {liveStreamButton.title}
      </Button>
    </Link>
  ) : null;
};

export default HomepageLiveStream;
