'use client';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const EventsPage = () => {
  const CalendarViewNoSSR = useMemo(
    () =>
      dynamic(() => import('../../../../components/events/CalendarView'), {
        ssr: false
      }),
    []
  );

  return <CalendarViewNoSSR />;
};

export default EventsPage;
