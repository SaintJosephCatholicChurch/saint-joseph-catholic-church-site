import { styled } from '@mui/material/styles';
import { memo } from 'react';

import getContainerQuery from '../../util/container.util';
import transientOptions from '../../util/transientOptions';

import type { ReactNode } from 'react';

interface StyledHeaderProps {
  $enableMarginTop: boolean;
}

const StyledHeader = styled(
  'header',
  transientOptions
)<StyledHeaderProps>(
  ({ $enableMarginTop }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    ${$enableMarginTop ? 'margin-top: 16px' : ''}

    &:first-of-type h1 {
      margin-top: 0;
    }
  `
);

const StyledTitle = styled(
  'h1'
)(
  ({ theme }) => `
    padding: 0;
    margin: 8px 0;
    color: #333;
    font-size: 2em;
    font-family: Oswald,Helvetica,Arial,sans-serif;
    font-weight: bold;

    ${getContainerQuery(theme.breakpoints.down('sm'))} {
      font-size: 24px;
    }
  `
);

interface PostTitleProps {
  title: ReactNode;
  enableMarginTop?: boolean;
}

const PostTitle = memo(({ title, enableMarginTop = false }: PostTitleProps) => {
  return (
    <StyledHeader $enableMarginTop={enableMarginTop}>
      <StyledTitle>{title}</StyledTitle>
    </StyledHeader>
  );
});

PostTitle.displayName = 'PostTitle';

export default PostTitle;
