/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
import { createPlugin, sliceEvents } from '@fullcalendar/react';
import { styled } from '@mui/material/styles';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import MobileListEvent from './MobileListEvent';

import type { CalendarApi, DateProfile, default as FullCalendar, Duration, ViewProps } from '@fullcalendar/react';
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
    const [api, setApi] = useState<CalendarApi | undefined>();

    const currentCalendar = calendarRef.current;
    useLayoutEffect(() => {
      setApi(currentCalendar?.getApi());
    }, [currentCalendar]);

    const segs = useMemo(() => sliceEvents(props, true), [props]);

    const getEventById = useCallback(
      (eventId: string) => {
        return api?.getEvents().find((event) => event._def.defId === eventId);
      },
      [api]
    );

    const handleOnClick = useCallback(
      (eventId: string) => (jsEvent: MouseEvent<HTMLButtonElement>) => {
        const event = getEventById(eventId);
        api?.trigger('eventClick', {
          el: jsEvent.currentTarget,
          event,
          jsEvent: jsEvent.nativeEvent,
          view: api?.view
        });
      },
      [api, getEventById]
    );

    const sortedSegs = useMemo(() => {
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
      return newSegs;
    }, [segs]);

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
    views: {
      mobileList: MobileListView(calendarRef)
    }
  });

export default createMobileViewPlugin;
