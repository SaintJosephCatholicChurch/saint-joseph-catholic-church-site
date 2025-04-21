'use client';
/* eslint-disable react/display-name */
import { createPlugin, sliceEvents } from '@fullcalendar/core';
import { styled } from '@mui/material/styles';

import MobileListEvent from './MobileListEvent';

import type { Duration } from '@fullcalendar/core';
import type { DateProfile, EventImpl, ViewProps } from '@fullcalendar/core/internal';
import type { default as FullCalendar } from '@fullcalendar/react';
import type { MouseEvent, MutableRefObject } from 'react';

const StyledMobileListView = styled('div')`
  padding: 0 24px;
`;

const StyledEvents = styled('div')`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;

const MobileListView =
  (calendarRef: MutableRefObject<FullCalendar>) =>
  (
    props: ViewProps & {
      dateProfile: DateProfile;
      nextDayThreshold: Duration;
    }
  ) => {
    const api = calendarRef.current?.getApi();

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

    const newSegs = [...segs];
    newSegs.sort((a, b) => {
      if (a.def.allDay && b.def.allDay) {
        return 0;
      }

      if (a.def.allDay) {
        return -1;
      }

      if (b.def.allDay) {
        return 1;
      }

      return a.range.start.getTime() - b.range.start.getTime();
    });
    const sortedSegs = newSegs;

    return (
      <StyledMobileListView>
        <StyledEvents>
          {sortedSegs.length > 0
            ? sortedSegs.map((seg) => (
                <MobileListEvent key={`event-${seg.def.defId}`} segment={seg} onClick={handleOnClick(seg.def.defId)} />
              ))
            : 'No events'}
        </StyledEvents>
      </StyledMobileListView>
    );
  };

const createMobileViewPlugin = (calendarRef: MutableRefObject<FullCalendar>) =>
  createPlugin({
    name: 'mobile-list-view',
    views: {
      mobileList: MobileListView(calendarRef)
    }
  });

export default createMobileViewPlugin;
