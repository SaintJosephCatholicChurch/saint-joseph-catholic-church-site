'use client';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import { memo } from 'react';

const StyledRecentNewsSkeleton = styled('div')`
  display: flex;
  gap: 8px;
  padding: 9px 0;
`;

const StyledPostDetails = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  overflow: hidden;
  color: #4f4f4f;
`;

const RecentNewsSkeleton = memo(() => {
  return (
    <StyledRecentNewsSkeleton>
      <StyledPostDetails>
        <Skeleton animation="wave" height={24} style={{ marginBottom: 2 }} />
        <Skeleton animation="wave" height={14} />
        <Skeleton animation="wave" height={14} />
        <Skeleton animation="wave" height={14} width="80%" />
      </StyledPostDetails>
    </StyledRecentNewsSkeleton>
  );
});

RecentNewsSkeleton.displayName = 'RecentNewsSkeleton';

export default RecentNewsSkeleton;
