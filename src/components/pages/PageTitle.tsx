import { memo } from 'react';
import styled from '../../util/styled.util';

const StyledHeader = styled('header')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  &:first-child h1 {
    margin-top: 0;
  }
`;

const StyledTitle = styled('h1')`
  padding: 0;
  margin: 16px 0;
  color: #333;
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
