import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import { memo } from 'react';

const StyledRecentNewsSkeleton = styled('div')`
  display: flex;
  gap: 8px;
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
      <Skeleton variant="rectangular" width={110} height={72} sx={{ flexShrink: 0}} />
      <StyledPostDetails>
        <Skeleton animation="wave" height={24} style={{ marginBottom: 2 }} />
        <Skeleton animation="wave" height={10} style={{ marginBottom: 4 }} />
        <Skeleton animation="wave" height={10} width="80%" />
      </StyledPostDetails>
    </StyledRecentNewsSkeleton>
  );
});

RecentNewsSkeleton.displayName = 'RecentNewsSkeleton';

export default RecentNewsSkeleton;
