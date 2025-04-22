import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import { memo } from 'react';

const StyledPostSkeleton = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const PostSkeleton = memo(() => {
  return (
    <StyledPostSkeleton>
      <Skeleton animation="wave" height={48} width="90%" style={{ marginBottom: 8 }} />
      <Skeleton animation="wave" height={10} width="15%" style={{ marginBottom: 16 }} />
      <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
      <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
      <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 16 }} />
      <Skeleton animation="wave" height={10} width="10%" style={{ marginBottom: 12 }} />
    </StyledPostSkeleton>
  );
});

PostSkeleton.displayName = 'PostSkeleton';

export default PostSkeleton;
