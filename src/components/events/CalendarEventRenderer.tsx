import type { CustomContentGenerator, EventContentArg } from '@fullcalendar/react';
import CalendarEvent from './CalendarEvent';

const CalendarEventRenderer: CustomContentGenerator<EventContentArg> = (eventInfo) => {
  return <CalendarEvent eventInfo={eventInfo} />;
};

export default CalendarEventRenderer;
