import Box from '@mui/material/Box';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { memo } from 'react';

const StyledTitle = styled(Box)`
  font-weight: 500;
  color: #333;
  padding: 0;
  margin: 0;
  margin-bottom: 24px;
  text-transform: uppercase;

  font-size: 24px;
  line-height: 24px;
  @media screen and (min-width: 1200px) {
    font-size: 30px;
  }
`;

type PostTitleProps = {
  title: string;
  sx?: SxProps<Theme>;
};

const PostTitle = memo(({ title, sx }: PostTitleProps) => {
  return <StyledTitle component="h3" sx={sx}>{title}</StyledTitle>;
});

PostTitle.displayName = 'PostTitle';

export default PostTitle;
