import Box from '@mui/material/Box';
import { PostContent, TagContent } from '../../interface';
import Pagination from '../Pagination';
import PostSummary from './PostSummary';

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
    <Box>
      {posts.map((post) => (
        <PostSummary key={`post-${post.data.slug}`} post={post} />
      ))}
      <Pagination
        current={pagination.current}
        pages={pagination.pages}
        link={{
          href: (page) => (page === 1 ? '/posts' : '/posts/page/[page]'),
          as: (page) => (page === 1 ? null : '/posts/page/' + page)
        }}
      />
    </Box>
  );
};

export default PostList;
