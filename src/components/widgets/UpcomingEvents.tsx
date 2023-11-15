// eslint-disable-next-line import/order
import FullCalendar from '@fullcalendar/react';

import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { addMonths } from 'date-fns';
import Link from 'next/link';
import { memo, useCallback, useMemo, useRef, useState } from 'react';

import getContainerQuery from '../../util/container.util';
import { useMediaQueryUp } from '../../util/useMediaQuery';
import { StyledLink } from '../common/StyledLink';
import CalendarEventDialog from '../events/CalendarEventDialog';
import CalendarEventPopover from '../events/CalendarEventPopover';
import CalendarEventRenderer from '../events/CalendarEventRenderer';
import createUpcomingListViewPlugin from '../events/upcoming/UpcomingEventsPlugin';

import type { EventClickArg } from '@fullcalendar/core';

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

const StyledCalendarWrapper = styled('div')`
  & .fc .fc-daygrid-day-frame {
    height: auto;
    min-height: 140px;
  }

  & .fc .fc-daygrid-body-natural .fc-daygrid-day-events {
    margin-bottom: 0;
  }
`;

const StyledViewCalendarLink = styled(StyledLink)(
  ({ theme }) => `
    font-weight: 500;
    font-size: 16px;
    font-family: 'Oswald', Helvetica, Arial, sans-serif;

    margin-top: 8px;
    ${getContainerQuery(theme.breakpoints.down('sm'))} {
      margin-top: 16px;
    }
  `
);

const UpcomingEvents = memo(() => {
  const calendarRef = useRef<FullCalendar>();

  const isMediumOrBiggerScreen = useMediaQueryUp('md');

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
        visibleRange={{
          start: new Date(),
          end: addMonths(new Date(), 1)
        }}
      />
    ),
    [handleEventClick]
  );

  return (
    <LocalizationProvider key="upcoming-events" dateAdapter={AdapterDateFns}>
      <StyledUpcomingEvents>
        <StyledUpcomingEventsTitle>Upcoming Events</StyledUpcomingEventsTitle>
        <StyledCalendarWrapper>{calendar}</StyledCalendarWrapper>
        <Link href="/events">
          <StyledViewCalendarLink>View Calendar</StyledViewCalendarLink>
        </Link>
      </StyledUpcomingEvents>
      {isMediumOrBiggerScreen ? (
        <CalendarEventPopover eventInfo={clickedEvent} open={clickedEventModalOpen} onClose={handlePopoverClose} />
      ) : (
        <CalendarEventDialog eventInfo={clickedEvent} open={clickedEventModalOpen} onClose={handlePopoverClose} />
      )}
    </LocalizationProvider>
  );
});

UpcomingEvents.displayName = 'UpcomingEvents';

export default UpcomingEvents;
