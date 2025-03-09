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
  // const theme = useTheme();

  return (
    <StyledPostSkeleton>
      {/* <Skeleton
        variant="rectangular"
        width="100%"
        sx={{
          flexShrink: 0,
          height: 400,
          [getContainerQuery(theme.breakpoints.down('lg'))]: {
            height: 325
          },
          [getContainerQuery(theme.breakpoints.down('md'))]: {
            height: 275
          },
          [getContainerQuery(theme.breakpoints.down('sm'))]: {
            height: 200
          }
        }}
      /> */}
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
