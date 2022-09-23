import { styled } from '@mui/material/styles';
import format from 'date-fns/format';
import formatISO from 'date-fns/formatISO';
import { memo } from 'react';
import transientOptions from '../../util/transientOptions';

interface StyledDateProps {
  $disableMargin: boolean;
}

const StyledDate = styled(
  'time',
  transientOptions
)<StyledDateProps>(
  ({ $disableMargin }) => `
    display: flex;
    color: #757575;
    margin-bottom: ${$disableMargin ? '0' : '16px'};
    font-size: 13px;
    font-weight: 400;
    line-height: 17px;
  `
);

interface PostDateAuthorLineProps {
  date: Date;
  disableMargin?: boolean;
}

const PostDateAuthorLine = memo(({ date, disableMargin }: PostDateAuthorLineProps) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return null;
  }

  return (
    <StyledDate $disableMargin={disableMargin} dateTime={formatISO(date)}>
      {format(date, 'LLLL d, yyyy')}
    </StyledDate>
  );
});

PostDateAuthorLine.displayName = 'PostDateAuthorLine';

export default PostDateAuthorLine;
