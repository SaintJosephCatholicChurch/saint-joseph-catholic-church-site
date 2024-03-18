/* eslint-disable react/display-name */
import { createPlugin, sliceEvents } from '@fullcalendar/core';
import { styled } from '@mui/material/styles';

import { UPCOMING_EVENTS_TO_SHOW } from '../../../constants';
import UpcomingListEvent from './UpcomingListEvent';

import type { Duration } from '@fullcalendar/core';
import type { DateProfile, EventImpl, ViewProps } from '@fullcalendar/core/internal';
import type { default as FullCalendar } from '@fullcalendar/react';
import type { MouseEvent, MutableRefObject } from 'react';

const StyledUpcomingListView = styled('div')`
  width: 100%;
`;

const StyledEvents = styled('div')`
  display: flex;
  flex-direction: column;
`;

const UpcomingListView =
  (calendarRef: MutableRefObject<FullCalendar>) =>
  (
    props: ViewProps & {
      dateProfile: DateProfile;
      nextDayThreshold: Duration;
    }
  ) => {
    const api = calendarRef.current?.getApi();
    const today = new Date();

    const segs = sliceEvents(props, false);

    const getEventById: (eventId: string) => EventImpl | undefined = (eventId) => {
      return api?.getEvents().find((event) => (event as EventImpl)._def.defId === eventId) as EventImpl | undefined;
    };

    const handleOnClick = (eventId: string) => (jsEvent: MouseEvent<HTMLButtonElement>) => {
      const event = getEventById(eventId);

      api?.trigger('eventClick', {
        el: jsEvent.currentTarget,
        event,
        jsEvent: jsEvent.nativeEvent,
        view: api?.view
      });
    };

    const newSegs = [...segs].filter(
      (seg) => seg.isStart && seg.range.end.getTime() + today.getTimezoneOffset() * 1000 * 60 >= today.getTime()
    );
    newSegs.sort((a, b) => a.range.start.getTime() - b.range.start.getTime());
    const sortedSegs = newSegs.slice(0, UPCOMING_EVENTS_TO_SHOW);

    return (
      <StyledUpcomingListView>
        <StyledEvents>
          {sortedSegs.map((seg) => (
            <UpcomingListEvent
              key={`upcoming-event-${seg.def.defId}`}
              segment={seg}
              onClick={handleOnClick(seg.def.defId)}
            />
          ))}
        </StyledEvents>
      </StyledUpcomingListView>
    );
  };

const createUpcomingEventsPlugin = (calendarRef: MutableRefObject<FullCalendar>) =>
  createPlugin({
    name: 'upcoming-events-view',
    views: {
      upcomingList: UpcomingListView(calendarRef)
    }
  });

export default createUpcomingEventsPlugin;
