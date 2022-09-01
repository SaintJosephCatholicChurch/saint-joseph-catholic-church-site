import { memo } from 'react';
import styled from '../../util/styled.util';

const StyledTitle = styled('h3')(
  ({ theme }) => `
    font-weight: 500;
    color: #333;
    padding: 0;
    margin: 0;
    margin-bottom: 24px;
    text-transform: uppercase;

    font-size: 24px;
    line-height: 24px;
    ${theme.breakpoints.up('lg')} {
      font-size: 30px;
    }
  `
);

interface PostTitleProps {
  title: string;
}

const PostTitle = memo(({ title }: PostTitleProps) => {
  return <StyledTitle>{title}</StyledTitle>;
});

PostTitle.displayName = 'PostTitle';

export default PostTitle;
