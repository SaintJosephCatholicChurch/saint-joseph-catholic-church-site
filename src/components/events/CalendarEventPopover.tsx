import Popover from '@mui/material/Popover';

import CalendarEventModalContent from './CalendarEventModalContent';
import useEventDateTimeText from './hooks/useEventDateTimeText';
import useEventTitle from './hooks/useEventTitle';

import type { EventClickArg } from '@fullcalendar/react';

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
        location={eventInfo?.event.extendedProps.location as string | undefined}
        description={eventInfo?.event.extendedProps.description as string | undefined}
      />
    </Popover>
  );
};

export default CalendarEventPopover;
