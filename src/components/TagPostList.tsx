import type { PostContent, TagContent } from '../interface';
import Pagination from './Pagination';
import PostSummary from './posts/PostSummary';

interface TagPostListProps {
  posts: PostContent[];
  tag: TagContent;
  pagination: {
    current: number;
    pages: number;
  };
}

const TagPostList = ({ posts, tag, pagination }: TagPostListProps) => {
  return (
    <div>
      <h1>
        All posts / <span>{tag.name}</span>
      </h1>
      {posts.map((post) => (
        <PostSummary key={`post-${post.data.slug}`} post={post} />
      ))}
      <Pagination
        current={pagination.current}
        pages={pagination.pages}
        firstPageLink={`/posts/tags/${tag.slug}`}
        pageLink={`/posts/tags/${tag.slug}/[page]`}
      />
    </div>
  );
};

export default TagPostList;
