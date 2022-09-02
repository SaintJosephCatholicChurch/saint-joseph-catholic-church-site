import { ReactNode } from 'react';
import styled from '../../util/styled.util';
import PageContentView from '../pages/PageContentView';
import PostDateAuthorLine from './PostDateAuthorLine';
import PostImage from './PostImage';
import PostTitle from '../pages/PageTitle';

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
