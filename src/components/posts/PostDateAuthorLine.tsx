import { styled, SxProps, Theme } from '@mui/material/styles';
import format from 'date-fns/format';
import formatISO from 'date-fns/formatISO';
import { memo } from 'react';

const StyledDate = styled('time')`
  display: flex;
  color: #757575;
  margin-bottom: 16px;
  font-size: 13px;
  font-weight: 400;
  line-height: 17px;
`;

interface PostDateAuthorLineProps {
  date: Date;
  sx?: SxProps<Theme>;
}

const PostDateAuthorLine = memo(({ date, sx }: PostDateAuthorLineProps) => {
  return (
    <StyledDate sx={sx} dateTime={formatISO(date)}>
      {format(date, 'LLLL d, yyyy')}
    </StyledDate>
  );
});

PostDateAuthorLine.displayName = 'PostDateAuthorLine';

export default PostDateAuthorLine;
