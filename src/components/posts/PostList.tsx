import { styled } from '@mui/material/styles';

import Pagination from '../Pagination';
import PostSummary from './PostSummary';

import type { PostContent } from '../../interface';

const StyledPostList = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

interface PostListProps {
  posts: PostContent[];
  tags: string[];
  pagination: {
    current: number;
    pages: number;
  };
}

const PostList = ({ posts, pagination }: PostListProps) => {
  return (
    <StyledPostList>
      {posts.map((post) => (
        <PostSummary key={`post-${post.data.slug}`} post={post} />
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

export default PostList;
