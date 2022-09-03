import { memo } from 'react';
import styled from '../../util/styled.util';

const StyledHeader = styled('header', ['disableMargin'])`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  &:first-child h1 {
    margin-top: 0;
  }
`;
interface StyledTitleProps {
  disableMargin: boolean;
}

const StyledTitle = styled('h1')<StyledTitleProps>(
  ({ disableMargin }) => `
    padding: 0;
    margin: ${disableMargin ? '0' : '16px 0'};
    color: #333;
  `
);

interface PostTitleProps {
  title: string;
  disableMargin: boolean;
}

const PostTitle = memo(({ title, disableMargin }: PostTitleProps) => {
  return (
    <StyledHeader>
      <StyledTitle disableMargin={disableMargin}>{title}</StyledTitle>
    </StyledHeader>
  );
});

PostTitle.displayName = 'PostTitle';

export default PostTitle;
