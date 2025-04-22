'use client';
// eslint-disable-next-line import/order
import FullCalendar from '@fullcalendar/react';

import dayGridPlugin from '@fullcalendar/daygrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import getContainerQuery from '../../util/container.util';
import useIsomorphicLayoutEffect from '../../util/useIsomorphicLayoutEffect';
import { useMediaQueryDown, useMediaQueryUp } from '../../util/useMediaQuery';
import CalendarEventDialog from './CalendarEventDialog';
import CalendarEventPopover from './CalendarEventPopover';
import CalendarEventRenderer from './CalendarEventRenderer';
import CalendarHeader from './CalendarHeader';
import createMobileListViewPlugin from './mobile-view/MobileListViewPlugin';

import type { CalendarApi, EventClickArg } from '@fullcalendar/core';

const StyledCalendarWrapper = styled('div')(
  ({ theme }) => `
    ${getContainerQuery(theme.breakpoints.up('sm'))} {
      padding: 0 24px;
    }

    & .fc .fc-daygrid-day-frame {
      height: auto;
      min-height: 140px;
    }

    & .fc .fc-daygrid-body-natural .fc-daygrid-day-events {
      margin-bottom: 0;
    }
  `
);

const CalendarView = () => {
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

  useLayoutEffect(() => {
    if (isSmallScreen) {
      calendarRef.current?.getApi().changeView('mobileList', new Date());
    } else {
      calendarRef.current?.getApi().changeView('dayGridMonth', new Date());
    }
  }, [isSmallScreen]);

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
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          googleCalendarPlugin,
          createMobileListViewPlugin(calendarRef)
        ]}
        initialView="dayGridMonth"
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
      />
    ),
    [handleEventClick]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledCalendarWrapper>
        <CalendarHeader title={title} api={api} isSmallScreen={isSmallScreen} />
        {calendar}
      </StyledCalendarWrapper>
      {isMediumOrBiggerScreen ? (
        <CalendarEventPopover eventInfo={clickedEvent} open={clickedEventModalOpen} onClose={handlePopoverClose} />
      ) : (
        <CalendarEventDialog eventInfo={clickedEvent} open={clickedEventModalOpen} onClose={handlePopoverClose} />
      )}
    </LocalizationProvider>
  );
};

export default CalendarView;
