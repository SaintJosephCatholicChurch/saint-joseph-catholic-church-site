'use client';
import { styled } from '@mui/material/styles';

import LiveStreamView from '../../../../components/pages/custom/live-stream/LiveStreamView';
import { EXTRA_EXTRA_SMALL_BREAKPOINT, MAX_APP_WIDTH } from '../../../../constants';
import getContainerQuery from '../../../../util/container.util';
import useElementSize from '../../../../util/useElementSize';

import type { FC } from 'react';

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

export interface LiveStreamPageContentProps {
  facebookPage: string;
}

const LiveStreamPageContent: FC<LiveStreamPageContentProps> = ({ facebookPage }) => {
  const [ref, { width }] = useElementSize();

  return (
    <StyledLiveStreamPageContent ref={ref}>
      <LiveStreamView facebookPage={facebookPage} width={width} />
    </StyledLiveStreamPageContent>
  );
};

export default LiveStreamPageContent;
