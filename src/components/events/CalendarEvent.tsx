import { styled } from '@mui/material/styles';

import useEventTitle from './hooks/useEventTitle';

import type { EventContentArg } from '@fullcalendar/react';

const StyleEvent = styled('div')`
  padding: 4px 8px;
  display: flex;
  gap: 4px;
  cursor: pointer;
  overflow: hidden;
  color: #333;
`;

const StyledTime = styled('div')`
  font-size: 12px;
`;

const StyledTitle = styled('div')`
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
  font-weight: bold;
  font-size: 12px;
`;

interface CalendarEventProps {
  eventInfo: EventContentArg;
}

const CalendarEvent = ({ eventInfo }: CalendarEventProps) => {
  const title = useEventTitle(eventInfo.event.title);

  return (
    <>
      <StyleEvent aria-haspopup="true" title={`${eventInfo.timeText} ${eventInfo.event.title}`}>
        <StyledTime>{eventInfo.timeText}</StyledTime>
        <StyledTitle>{title}</StyledTitle>
      </StyleEvent>
    </>
  );
};

export default CalendarEvent;
