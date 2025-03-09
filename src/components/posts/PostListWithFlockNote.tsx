import { styled } from '@mui/material/styles';

import Pagination from '../Pagination';
import PostSkeleton from './PostSkeleton';
import PostSummary from './PostSummary';
import usePosts from './hooks/usePosts';

import type { PostContent } from '../../interface';

const StyledPostList = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

interface PostListProps {
  allPosts: PostContent[];
  pagination: {
    start: number;
    total: number;
    current: number;
    pages: number;
  };
}

const PostListWithFlockNote = ({ allPosts, pagination }: PostListProps) => {
  const { loaded, data: posts } = usePosts(pagination.start, pagination.total, allPosts);

  if (!loaded) {
    return (
      <StyledPostList>
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </StyledPostList>
    );
  }

  return (
    <StyledPostList>
      {posts.map((post) => (
        <PostSummary key={`post-${post.link}`} post={post} />
      ))}
      <Pagination
        current={pagination.current}
        pages={pagination.pages}
        firstPageLink="/news"
        pageLink="/news/page/[page]"
      />
    </StyledPostList>
  );
};

export default PostListWithFlockNote;
