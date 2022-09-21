import { styled } from '@mui/material/styles';
import type { PostContent, TagContent } from '../../interface';
import Pagination from '../Pagination';
import PostSummary from './PostSummary';

const StyledPostList = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

interface PostListProps {
  posts: PostContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
}

const PostList = ({ posts, tags, pagination }: PostListProps) => {
  return (
    <StyledPostList>
      {posts.map((post) => (
        <PostSummary key={`post-${post.data.slug}`} post={post} />
      ))}
      <Pagination
        current={pagination.current}
        pages={pagination.pages}
        firstPageLink="/posts"
        pageLink="/posts/page/[page]"
      />
    </StyledPostList>
  );
};

export default PostList;
