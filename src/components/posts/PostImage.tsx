import Image from 'next/image';
import { memo } from 'react';
import { BLOG_IMAGE_DEFAULT_HEIGHT, BLOG_IMAGE_DEFAULT_WIDTH } from '../../constants';

type PostImageProps = {
  title: string;
  image: string;
};

const PostImage = memo(({ title, image }: PostImageProps) => {
  return (
    <Image
      src={image}
      width={BLOG_IMAGE_DEFAULT_WIDTH}
      height={BLOG_IMAGE_DEFAULT_HEIGHT}
      alt={title}
      layout="responsive"
    />
  );
});

PostImage.displayName = 'PostImage';

export default PostImage;
