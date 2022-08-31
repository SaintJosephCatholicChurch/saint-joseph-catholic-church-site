import Box from '@mui/material/Box';
import { styled, SxProps, Theme } from '@mui/material/styles';
import format from 'date-fns/format';
import { memo } from 'react';

const StyledDate = styled(Box)`
  color: #757575;
  margin-bottom: 16px;
  font-size: 13px;
  font-weight: 400;
  line-height: 17px;
`;

type PostDateAuthorLineProps = {
  date: Date;
  sx?: SxProps<Theme>;
};

const PostDateAuthorLine = memo(({ date, sx }: PostDateAuthorLineProps) => {
  return <StyledDate sx={sx}>{format(date, 'MMMM d, yyyy')}</StyledDate>;
});

PostDateAuthorLine.displayName = 'PostDateAuthorLine';

export default PostDateAuthorLine;
