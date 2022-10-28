/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
import { createPlugin, sliceEvents } from '@fullcalendar/react';
import { styled } from '@mui/material/styles';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { UPCOMING_EVENTS_TO_SHOW } from '../../../constants';
import UpcomingListEvent from './UpcomingListEvent';

import type { CalendarApi, DateProfile, default as FullCalendar, Duration, ViewProps } from '@fullcalendar/react';
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
      const newSegs = [...segs].filter((seg) => seg.isStart);
      newSegs.sort((a, b) => a.range.start.getTime() - b.range.start.getTime());
      return newSegs.slice(0, UPCOMING_EVENTS_TO_SHOW);
    }, [segs]);

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
    views: {
      upcomingList: UpcomingListView(calendarRef)
    }
  });

export default createUpcomingEventsPlugin;
