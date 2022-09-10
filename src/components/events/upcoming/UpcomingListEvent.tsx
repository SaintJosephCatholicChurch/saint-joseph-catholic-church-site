import type { EventRenderRange } from '@fullcalendar/react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import format from 'date-fns/format';
import { MouseEvent, useMemo } from 'react';
import { formatAsUtc } from '../../../util/date.util';
import styled from '../../../util/styled.util';
import useEventTitle from '../hooks/useEventTitle';

const StyledUpcomingEvent = styled('div')`
  display: grid;
  grid-template-columns: 80px auto;
  width: 100%;
  align-items: flex-start;
  gap: 12px;
`;

const StyledUpcomingEventDateTime = styled('div')`
  background-color: #bc2f3b;
  color: #ffffff;
  font-size: 14px;
  width: 100%;
  height: 56px;
  padding: 8px;
  gap: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledUpcomingEventDate = styled('div')`
  font-size: 18px;
  line-height: 18px;
  font-weight: 600;
`;

const StyledUpcomingEventTime = styled('div')`
  font-size: 14px;
  line-height: 14px;
`;

const StyledUpcomingEventBody = styled('div')`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  overflow: hidden;
`;

const StyledUpcomingEventTitle = styled('h3')`
  margin: 0;
  font-size: 16px;
  font-weight: 500px;
  color: #333;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  text-transform: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  display: block;
  overflow: hidden;
`;

const StyledUpcomingEventLocation = styled('div')`
  font-size: 14px;
  color: #222;
  text-align: left;
  text-transform: none;
`;

interface UpcomingListEventProps {
  segment: EventRenderRange;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const UpcomingListEvent = ({ segment, onClick }: UpcomingListEventProps) => {
  const monthAndDay = useMemo(() => format(segment.range.start, 'MMM d'), [segment.range.start]);

  const time = useMemo(() => {
    if (segment.def.allDay) {
      return 'All Day';
    }

    if (segment.isStart) {
      return formatAsUtc(segment.range.start, 'h:mmaaa');
    }

    return `Till ${formatAsUtc(segment.range.end, 'h:mmaaa')}`;
  }, [segment.def.allDay, segment.isStart, segment.range.end, segment.range.start]);

  const title = useEventTitle(segment.def.title);

  return (
    <Button onClick={onClick} sx={{ p: '8px', m: '0 -8px' }}>
      <StyledUpcomingEvent>
        <StyledUpcomingEventDateTime>
          <StyledUpcomingEventDate>{monthAndDay}</StyledUpcomingEventDate>
          <StyledUpcomingEventTime>{time}</StyledUpcomingEventTime>
        </StyledUpcomingEventDateTime>
        <StyledUpcomingEventBody>
          <StyledUpcomingEventTitle>{title}</StyledUpcomingEventTitle>
          {segment.def.extendedProps.location ? (
            <StyledUpcomingEventLocation>{segment.def.extendedProps.location}</StyledUpcomingEventLocation>
          ) : null}
        </StyledUpcomingEventBody>
      </StyledUpcomingEvent>
    </Button>
  );
};

export default UpcomingListEvent;
