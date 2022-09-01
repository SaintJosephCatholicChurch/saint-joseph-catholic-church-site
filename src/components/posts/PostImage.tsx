import { memo } from 'react';
import styled from '../../util/styled.util';

const StyledImage = styled('img')`
  width: 100%;
  height: auto;
`;

interface PostImageProps {
  title: string;
  image: string;
}

const PostImage = memo(({ title, image }: PostImageProps) => {
  return <StyledImage src={image} alt={title} />;
});

PostImage.displayName = 'PostImage';

export default PostImage;
