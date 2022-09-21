import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
import PageContentView from '../pages/PageContentView';
import PostTitle from '../pages/PageTitle';
import PostDateAuthorLine from './PostDateAuthorLine';
import PostImage from './PostImage';

const StyledPageContentWrapper = styled('div')`
  margin-top: 32px;
`;

interface PostViewProps {
  title: string;
  date: Date;
  image: string;
  children: ReactNode;
}

const PostView = ({ title, date, image, children }: PostViewProps) => {
  return (
    <>
      <PostTitle title={title} />
      <PostDateAuthorLine date={date} />
      <PostImage title={title} image={image} />
      <StyledPageContentWrapper>
        <PageContentView>{children}</PageContentView>
      </StyledPageContentWrapper>
    </>
  );
};

export default PostView;
