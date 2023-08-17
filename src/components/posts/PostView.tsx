import { isNotEmpty } from '../../util/string.util';
import PageContentView from '../pages/PageContentView';
import PostTitle from '../pages/PageTitle';
import Tags from '../Tags';
import PostDateAuthorLine from './PostDateAuthorLine';
import PostImage from './PostImage';

import type { ReactNode } from 'react';

interface PostViewProps {
  title: string;
  date: Date;
  image: string;
  tags: string[];
  children: ReactNode;
}

const PostView = ({ title, date, image, children, tags }: PostViewProps) => {
  return (
    <>
      <PostTitle title={title} />
      <PostDateAuthorLine date={date} />
      {isNotEmpty(image) ? <PostImage title={title} image={image} /> : null}
      {tags.length ? <Tags tags={tags} /> : null}
      <PageContentView>{children}</PageContentView>
    </>
  );
};

export default PostView;
