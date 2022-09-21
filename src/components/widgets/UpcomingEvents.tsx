import FullCalendar from '@fullcalendar/react';

import googleCalendarPlugin from '@fullcalendar/google-calendar';
import type { CalendarApi, EventClickArg } from '@fullcalendar/react';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { addMonths } from 'date-fns';
import { useCallback, useMemo, useRef, useState } from 'react';
import useIsomorphicLayoutEffect from '../../util/useIsomorphicLayoutEffect';
import { useMediaQueryDown, useMediaQueryUp } from '../../util/useMediaQuery';
import CalendarEventDialog from '../events/CalendarEventDialog';
import CalendarEventPopover from '../events/CalendarEventPopover';
import CalendarEventRenderer from '../events/CalendarEventRenderer';
import createUpcomingListViewPlugin from '../events/upcoming/UpcomingEventsPlugin';

const StyledUpcomingEvents = styled('div')`
  display: flex;
  flex-direction: column;
`;

const StyledUpcomingEventsTitle = styled('h3')`
  margin: 0;
  margin-bottom: 8px;
  text-transform: uppercase;
  color: #333;
  font-size: 24px;
  font-weight: 500;
`;

const StyledCalendarWrapper = styled('div')(
  ({ theme }) => `
    & .fc .fc-daygrid-day-frame {
      height: auto;
      min-height: 140px;
    }

    & .fc .fc-daygrid-body-natural .fc-daygrid-day-events {
      margin-bottom: 0;
    }
  `
);

interface UpcomingEventsProps {
  size?: 'small' | 'large';
}

const UpcomingEvents = ({ size = 'small' }: UpcomingEventsProps) => {
  const calendarRef = useRef<FullCalendar>();

  const [api, setApi] = useState<CalendarApi | undefined>();
  const [title, setTitle] = useState<string | undefined>();

  const isSmallScreen = useMediaQueryDown('sm');
  const isMediumOrBiggerScreen = useMediaQueryUp('md');

  useIsomorphicLayoutEffect(() => {
    const newApi = calendarRef.current?.getApi();
    setApi(newApi);
    setTitle(newApi?.view.title);
  }, []);

  const [clickedEventModalOpen, setClickedEventModalOpen] = useState(false);
  const [clickedEvent, setClickedEvent] = useState<EventClickArg | null>(null);
  const handleEventClick = useCallback((event: EventClickArg) => {
    setClickedEvent(event);
    setClickedEventModalOpen(true);
  }, []);

  const handlePopoverClose = () => {
    setClickedEventModalOpen(false);
    setTimeout(() => {
      setClickedEvent(null);
    }, 250);
  };

  const calendar = useMemo(
    () => (
      <FullCalendar
        ref={calendarRef}
        plugins={[googleCalendarPlugin, createUpcomingListViewPlugin(calendarRef)]}
        initialView="upcomingList"
        height="auto"
        headerToolbar={false}
        events={{
          googleCalendarId: 'feam606g74ah7rclvr38pfasr4@group.calendar.google.com',
          googleCalendarApiKey: 'AIzaSyB16En1nAGqZ763C5_40CIzKaH2IIRTNgY',
          url: ''
        }}
        eventContent={CalendarEventRenderer}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }}
        eventDataTransform={(eventData) => {
          const newEventData = { ...eventData };
          delete newEventData.url;
          return newEventData;
        }}
        eventClick={(eventData) => {
          handleEventClick(eventData);
        }}
        datesSet={() => {
          setTitle(calendarRef.current?.getApi().view.title);
        }}
        visibleRange={{
          start: new Date(),
          end: addMonths(new Date(), 1)
        }}
      />
    ),
    [handleEventClick]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledUpcomingEvents>
        <StyledUpcomingEventsTitle>Upcoming Events</StyledUpcomingEventsTitle>
        <StyledCalendarWrapper>{calendar}</StyledCalendarWrapper>
      </StyledUpcomingEvents>
      {isMediumOrBiggerScreen ? (
        <CalendarEventPopover eventInfo={clickedEvent} open={clickedEventModalOpen} onClose={handlePopoverClose} />
      ) : (
        <CalendarEventDialog eventInfo={clickedEvent} open={clickedEventModalOpen} onClose={handlePopoverClose} />
      )}
    </LocalizationProvider>
  );
};

export default UpcomingEvents;
