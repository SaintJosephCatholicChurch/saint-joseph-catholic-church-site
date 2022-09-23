import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
import PageContentView from '../pages/PageContentView';
import PostTitle from '../pages/PageTitle';
import Tags from '../Tags';
import PostDateAuthorLine from './PostDateAuthorLine';
import PostImage from './PostImage';

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
      <PostImage title={title} image={image} />
      <Tags tags={tags} />
      <PageContentView>{children}</PageContentView>
    </>
  );
};

export default PostView;
