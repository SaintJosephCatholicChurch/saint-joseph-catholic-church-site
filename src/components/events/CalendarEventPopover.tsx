import type { EventClickArg } from '@fullcalendar/react';
import Popover from '@mui/material/Popover';
import styled from '../../util/styled.util';
import CalendarEventModalContent from './CalendarEventModalContent';
import useEventDateTimeText from './hooks/useEventDateTimeText';
import useEventTitle from './hooks/useEventTitle';

interface CalendarEventPopoverProps {
  eventInfo: EventClickArg | null;
  open: boolean;
  onClose: () => void;
}

const CalendarEventPopover = ({ eventInfo, open, onClose }: CalendarEventPopoverProps) => {
  const title = useEventTitle(eventInfo?.event.title);
  const [date, time] = useEventDateTimeText(
    eventInfo?.event.start,
    eventInfo?.event.end,
    Boolean(eventInfo?.event.allDay)
  );

  return (
    <Popover
      open={open}
      anchorEl={eventInfo?.el}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      onClose={onClose}
      disableRestoreFocus
    >
      <CalendarEventModalContent
        title={title}
        date={date}
        time={time}
        location={eventInfo?.event.extendedProps.location}
        description={eventInfo?.event.extendedProps.description}
      />
    </Popover>
  );
};

export default CalendarEventPopover;
