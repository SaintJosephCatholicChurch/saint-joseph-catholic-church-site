import { TagContent } from '../interface';

interface TagProps {
  tag?: TagContent;
}

const Tag = ({ tag }: TagProps) => {
  if (!tag) {
    return null;
  }

  return (
    <a href={`/posts/tags/${tag.slug}`}>
      <a>{'#' + tag.name}</a>
    </a>
  );
};

export default Tag;
