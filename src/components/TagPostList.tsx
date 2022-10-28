import { styled } from '@mui/material/styles';

import Pagination from './Pagination';
import PostSummary from './posts/PostSummary';

import type { PostContent } from '../interface';

const StyledPostList = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

interface TagPostListProps {
  posts: PostContent[];
  tag: string;
  pagination: {
    current: number;
    pages: number;
  };
}

const TagPostList = ({ posts, tag, pagination }: TagPostListProps) => {
  return (
    <StyledPostList>
      {posts.map((post) => (
        <PostSummary key={`post-${post.data.slug}`} post={post} />
      ))}
      <Pagination
        current={pagination.current}
        pages={pagination.pages}
        firstPageLink={`/news/tags/${tag}`}
        pageLink={`/news/tags/${tag}/[page]`}
      />
    </StyledPostList>
  );
};

export default TagPostList;
