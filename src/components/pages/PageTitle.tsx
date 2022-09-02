import { memo } from 'react';
import styled from '../../util/styled.util';

const StyledHeader = styled('header')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin-bottom: 24px;
`;

const StyledTitle = styled('h1')`
  padding: 0;
  margin: 0;
`;

interface PostTitleProps {
  title: string;
}

const PostTitle = memo(({ title }: PostTitleProps) => {
  return (
    <StyledHeader>
      <StyledTitle>{title}</StyledTitle>
    </StyledHeader>
  );
});

PostTitle.displayName = 'PostTitle';

export default PostTitle;
