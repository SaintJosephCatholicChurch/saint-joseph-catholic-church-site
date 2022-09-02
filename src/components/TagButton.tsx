import type { TagContent } from '../interface';

interface TagButtonProps {
  tag: TagContent;
}

const TagButton = ({ tag }: TagButtonProps) => {
  return (
    <>
      <a href={`/posts/tags/${tag.slug}`}>
        <a>{tag.name}</a>
      </a>
    </>
  );
};

export default TagButton;
