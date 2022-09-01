import format from 'date-fns/format';
import formatISO from 'date-fns/formatISO';
import { memo } from 'react';
import styled from '../../util/styled.util';

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
}

const PostDateAuthorLine = memo(({ date }: PostDateAuthorLineProps) => {
  return <StyledDate dateTime={formatISO(date)}>{format(date, 'LLLL d, yyyy')}</StyledDate>;
});

PostDateAuthorLine.displayName = 'PostDateAuthorLine';

export default PostDateAuthorLine;
