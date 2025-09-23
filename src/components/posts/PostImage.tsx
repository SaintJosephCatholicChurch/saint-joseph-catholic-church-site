import { styled } from '@mui/material/styles';
import { memo } from 'react';

const StyledImage = styled('img')`
  width: 100%;
  height: auto;
`;

interface PostImageProps {
  title: string;
  image: string;
}

const PostImage = memo(({ title, image }: PostImageProps) => {
  return <StyledImage src={image} alt={title} loading="lazy" decoding="async" />;
});

PostImage.displayName = 'PostImage';

export default PostImage;
