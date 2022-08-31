import Box from '@mui/material/Box';
import { SerializedPostContent } from '../interface';
import { TagContent } from '../lib/tags';
import Pagination from './Pagination';
import PostSummary from './posts/PostSummary';

type Props = {
  posts: SerializedPostContent[];
  tags: TagContent[];
  pagination: {
    current: number;
    pages: number;
  };
};
export default function PostList({ posts, tags, pagination }: Props) {
  console.log('[data]', posts);
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
}
