import { PostContent } from '../interface';
import { TagContent } from '../lib/tags';
import Pagination from './Pagination';
import PostItem from './PostItem';

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
      <ul>
        {posts.map((it, i) => (
          <li key={i}>
            <PostItem post={it} />
          </li>
        ))}
      </ul>
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
