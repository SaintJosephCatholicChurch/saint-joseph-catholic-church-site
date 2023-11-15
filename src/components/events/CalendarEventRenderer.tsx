import CalendarEvent from './CalendarEvent';

import type { CustomContentGenerator, EventContentArg } from '@fullcalendar/core';

const CalendarEventRenderer: CustomContentGenerator<EventContentArg> = (eventInfo) => {
  return <CalendarEvent eventInfo={eventInfo} />;
};

export default CalendarEventRenderer;
