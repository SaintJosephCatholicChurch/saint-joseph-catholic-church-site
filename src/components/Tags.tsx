import { styled } from '@mui/material/styles';
import { memo, useMemo } from 'react';
import TagLink from './TagLink';

const StyledTags = styled('div')`
  display: flex;
  gap: 8px;
  padding-top: 16px;
`;

interface PostTagsProps {
  tags: string[];
}

const PostTags = memo(({ tags }: PostTagsProps) => {
  const uniqueTags = useMemo(() => tags.filter((value, index, self) => self.indexOf(value) === index), [tags]);

  return (
    <StyledTags>
      {uniqueTags.map((tag) => (
        <TagLink key={`tag-${tag}`} tag={tag} />
      ))}
    </StyledTags>
  );
});

PostTags.displayName = 'PostTags';

export default PostTags;
