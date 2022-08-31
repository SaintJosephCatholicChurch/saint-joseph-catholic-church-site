import { SerializedPostContent, TagContent } from '../interface';
import Pagination from './Pagination';
import PostSummary from './posts/PostSummary';

interface TagPostListProps {
  posts: SerializedPostContent[];
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
        link={{
          href: () => '/posts/tags/[[...slug]]',
          as: (page) => (page === 1 ? '/posts/tags/' + tag.slug : `/posts/tags/${tag.slug}/${page}`)
        }}
      />
    </div>
  );
};

export default TagPostList;
