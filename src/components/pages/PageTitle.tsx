import { styled } from '@mui/material/styles';
import { memo } from 'react';
import transientOptions from '../../util/transientOptions';

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

interface StyledTitleProps {
  $disableMargin: boolean;
}

const StyledTitle = styled(
  'h1',
  transientOptions
)<StyledTitleProps>(
  ({ $disableMargin }) => `
    padding: 0;
    margin: ${$disableMargin ? '0' : '16px 0'};
    color: #333;
  `
);

interface PostTitleProps {
  title: string;
  disableMargin?: boolean;
  enableMarginTop?: boolean;
}

const PostTitle = memo(({ title, enableMarginTop = false, disableMargin = false }: PostTitleProps) => {
  return (
    <StyledHeader $enableMarginTop={enableMarginTop}>
      <StyledTitle $disableMargin={disableMargin}>{title}</StyledTitle>
    </StyledHeader>
  );
});

PostTitle.displayName = 'PostTitle';

export default PostTitle;
